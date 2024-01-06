import { Hono } from "hono";
import ytdl, { videoFormat } from "ytdl-core";
import ytpl from "ytpl";
import { engine } from "./instances.js";
import { livereloadMiddleware } from "./middlewares.js";
import * as settings from "./settings.js";

export const app = new Hono();

// livereload는 개발 환경에서만 살아있도록 하고싶다
// 번들링에서도 명시적으로 제외하고 싶다
if (settings.NODE_ENV === "development") {
	app.use(livereloadMiddleware());
}

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

app.get("/audio/:videoId", async (c) => {
	const videoId = c.req.param('videoId');
	const result = await main_audio(videoId);
	return c.json(result);
});

app.get("/playlist/:playlistId", async (c) => {
	const playlistId = c.req.param('playlistId');
	const result = await main_playlist(playlistId);
	return c.json(result);
});

app.get("/", async (c) => {
	const html = await engine.renderFileSync("index", { name: "foo11" });
	return c.html(html);
});
