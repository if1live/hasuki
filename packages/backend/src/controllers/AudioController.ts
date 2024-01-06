import { Hono } from "hono";
import ytdl, { videoFormat } from "ytdl-core";

const app = new Hono();

const toYouTubeUrl = (videoId: string) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

const compareHighBitrate = (a: videoFormat, b: videoFormat) => {
  const a_val = a.audioBitrate ?? -1;
  const b_val = b.audioBitrate ?? -1;
  return b_val - a_val;
};

const isAudioFormat = (format: videoFormat) => !format.width && !format.height;

async function main_audio(videoId: string) {
  const youtubeUrl = toYouTubeUrl(videoId);
  const info = await ytdl.getInfo(youtubeUrl);
  const formats = info.formats
    .filter((x) => x.hasAudio && !x.hasVideo)
    .filter(isAudioFormat)
    .sort(compareHighBitrate);
  return formats;
}

app.get("/:videoId", async (c) => {
  const videoId = c.req.param("videoId");
  const result = await main_audio(videoId);
  return c.json(result);
});

export const audioRoot = {
  prefix: "/audio",
  app,
} as const;
