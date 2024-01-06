import express from "express";
import asyncify from "express-asyncify";
import ytdl, { videoFormat } from "ytdl-core";
import ytpl from "ytpl";
import { engine } from "./instances.js";
import * as settings from "./settings.js";

export const app: express.Application = asyncify(express());

app.engine("liquid", engine.express());
app.set("views", "./views");
app.set("view engine", "liquid");

/*
// livereload는 개발 환경에서만 살아있도록 하고싶다
// 번들링에서도 명시적으로 제외하고 싶다
if (settings.NODE_ENV === "development") {
  const { default: livereloadMiddleware } = await import("connect-livereload");
  app.use(livereloadMiddleware());
}
*/

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

async function main_playlist(playlistId: string) {
  // 가공 없이 통으로 넘기기. 데이터 가공은 밖에서 수행
  const playlist = await ytpl(playlistId);
  return playlist;
}

app.get("/audio/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const result = await main_audio(videoId);
  res
    .status(200)
    .type("application/json")
    .send(JSON.stringify(result, null, 2));
});

app.get("/playlist/:playlistId", async (req, res) => {
  const playlistId = req.params.playlistId;
  const result = await main_playlist(playlistId);
  res
    .status(200)
    .type("application/json")
    .send(JSON.stringify(result, null, 2));
});

app.get("/", async (req, res) => {
  res.render("index", { name: "foo1" });
});
