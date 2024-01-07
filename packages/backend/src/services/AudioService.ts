import { Redis } from "ioredis";
import * as R from "remeda";
import ytdl from "ytdl-core";

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
  return R.pick(x, ["videoId", "title", "lengthSeconds", "thumbnails"]);
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
    return `hasuki:audio:${string}`;
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

    // URL 만료 예정 시간
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

    const fn_expire = () => {
      if (!expire_found) {
        // URL에서 만료 시간을 얻을수 없으면 임의로 24시간
        const expire_default = Math.floor(Date.now() / 1000) + 24 * 3600;
        return expire_default;
      }

      // 일시정지까지 생각해서 재생될 시간은 실제 영상보다 길어야한다.
      return expire_found - durationSeconds * 2;
    };

    const expire = fn_expire();
    const text = JSON.stringify(model);
    await redis.set(key, text, "EXAT", expire);
  },

  async del(redis: Redis, videoId: string) {
    const key = this.createKey(videoId);
    return await redis.del(key);
  },
};

export class AudioService {
  constructor(private redis: Redis) {}

  async load_immediate(videoId: string): Promise<AudioModel | null> {
    const info = await fetchYoutubeInfo(videoId);
    const model = AudioModel.from(info);
    await AudioCache.set(this.redis, model);
    return model;
  }

  async load_redis(videoId: string): Promise<AudioModel | null> {
    const model = await AudioCache.get(this.redis, videoId);
    return model;
  }

  async load(videoId: string): Promise<AudioModel | null> {
    const model_redis = await this.load_redis(videoId);
    if (model_redis) {
      return model_redis;
    }

    const model_immediate = await this.load_immediate(videoId);
    return model_immediate;
  }

  async del(videoId: string): Promise<number> {
    return await AudioCache.del(this.redis, videoId);
  }
}
