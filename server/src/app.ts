import express from 'express';
import cors from 'cors';
import ytdl, {
  videoInfo,
  videoFormat,
} from 'ytdl-core';
import 'express-async-errors';


export const app = express();
app.use(cors());

const toYouTubeUrl = (videoId: string) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};


const fetchYouTubeInfo = (url: string): Promise<videoInfo> => {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(url, (err: Error, info: any) => {
      if (err) { reject(err); }
      else { resolve(info); }
    });
  });
};

const compareHighBitrate = (a: any, b: any) => b.audioBitrate - a.audioBitrate;

const isAudioFormat = (format: videoFormat) => format.resolution === null;

const stripUnusedData = (format: videoFormat) => {
  // 불필요한 정보 빼서 데이터 줄이기
  format.lmt = undefined;
  format.xtags = undefined;
  format.index = undefined;
  format.clen = undefined;
  format.init = undefined;
  format.projection_type = undefined;
  return format;
};

app.get('/youtube/audio-url', async (req, res) => {
  const videoId = req.query.video_id;
  if (!videoId) {
    throw new Error('blank video id');
  }

  const youtubeUrl = toYouTubeUrl(videoId);
  try {
    const info = await fetchYouTubeInfo(youtubeUrl);
    const formats = info.formats
      .filter(isAudioFormat)
      .sort(compareHighBitrate)
      .map(stripUnusedData);
    res.send(formats);

  } catch (err) {
    throw err;
  }
});
