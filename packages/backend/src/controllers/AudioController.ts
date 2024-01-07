import { Hono } from "hono";
import { Redis } from "ioredis";
import * as R from "remeda";
import ytdl from "ytdl-core";
import { redis } from "../instances/index.js";

const app = new Hono();

const fetchYoutubeInfo = async (videoId: string) => {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const info = await ytdl.getInfo(url);
  return info;
};

const isAudioFormat = (format: ytdl.videoFormat) => {
  return format.hasAudio && !format.hasVideo;
};

// audio url은 한번 받으면 일정 시간동안 살아있어서 캐싱할수 있다.
// 캐싱해두면 마지막으로 듣던 곡은 F5 눌러도 빠르게 불러올 수 있다.
// ytdl.getInfo()는 너무 커서 통쨰로 redis에 저장하면 터진다.
// 필요한 규격만 읽어서 처리해서 데이터 크기 줄이자
const pick_videoDetails = (x: ytdl.MoreVideoDetails) => {
  return R.pick(x, ["videoId", "title", "lengthSeconds"]);
};

const pick_format = (x: ytdl.videoFormat) => {
  return R.pick(x, [
    "mimeType",
    "audioBitrate",
    "url",
    "audioQuality",
    "approxDurationMs",
    "isHLS",
  ]);
};

interface AudioModel {
  formats: ReturnType<typeof pick_format>[];
  videoDetails: ReturnType<typeof pick_videoDetails>;
}

const AudioModel = {
  from(info: ytdl.videoInfo): AudioModel {
    const formats = R.pipe(
      info.formats,
      R.filter(isAudioFormat),
      R.sortBy((x) => x.audioBitrate ?? -1),
      R.map(pick_format),
    );

    return {
      formats,
      videoDetails: pick_videoDetails(info.videoDetails),
    };
  },
};

const AudioCache = {
  createKey(string: string) {
    return `hasuki:video:${string}`;
  },

  async get(redis: Redis, videoId: string): Promise<AudioModel | null> {
    const key = this.createKey(videoId);
    const text = await redis.get(key);
    return text ? (JSON.parse(text) as ytdl.videoInfo) : null;
  },

  async set(redis: Redis, model: AudioModel) {
    const videoId = model.videoDetails.videoId;
    const key = this.createKey(videoId);

    const durationSeconds = parseInt(model.videoDetails.lengthSeconds, 10);

    // URL 만료 예정 시간 (millis)
    const expire_found = R.pipe(
      model.formats,
      R.map((format) => new URL(format.url)),
      R.map((url) => {
        // 1704625140 같은 초 단위로 나온다.
        const expire = url.searchParams.get("expire");
        const expire_seconds = expire ? parseInt(expire, 10) : 0;
        return expire_seconds;
      }),
      R.minBy((x) => x),
    );

    const expire_default = Date.now() + 24 * 3600;
    const expire = expire_found
      ? expire_found - durationSeconds
      : expire_default;

    const text = JSON.stringify(model);
    await redis.set(key, text, "EXAT", expire);
  },
};

const load_immediate = async (videoId: string) => {
  const info = await fetchYoutubeInfo(videoId);
  const model = AudioModel.from(info);
  await AudioCache.set(redis, model);
  return model;
};

app.get("/api/:videoId/:strategyimmediate", async (c) => {
  const videoId = c.req.param("videoId");
  const model = await load_immediate(videoId);
  return c.json(model);
});

app.get("/api/:videoId/redis", async (c) => {
  const videoId = c.req.param("videoId");
  const model = await AudioCache.get(redis, videoId);
  return c.json(model);
});

app.get("/api/:videoId/", async (c) => {
  const videoId = c.req.param("videoId");

  const model_redis = await AudioCache.get(redis, videoId);
  if (model_redis) {
    return c.json(model_redis);
  }

  const model_immediate = await load_immediate(videoId);
  return c.json(model_immediate);
});

export const audioRoot = {
  prefix: "/audio",
  app,
} as const;
