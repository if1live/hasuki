import http from 'http';
import https from 'https';
import { App, Request, Response } from '@tinyhttp/app';
import ytdl, { videoFormat } from 'ytdl-core';
import ytpl from 'ytpl';
import fetch from 'node-fetch';

import { ExecuteStatementCommand, MyClient } from './sdk/index.js';

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

export const app = new App({
  onError: (err, req, res) => {
    if (err instanceof Error) {
      const error = {
        name: err.name,
        message: err.message,
        stack: err.stack
      };
      res.status(400).json(error);
    } else {
      res.status(500).json(err);
    }
  },
  noMatchHandler: (req: Request, res: Response) => {
    res.status(400).json({
      message: 'mismatch pattern'
    });
  }
});

app.get('/audio/:videoId', async (req: Request, res: Response) => {
  const videoId = req.params.videoId;
  const result = await main_audio(videoId);
  res.status(200).type('application/json').send(JSON.stringify(result, null, 2));
});

app.get('/playlist/:playlistId', async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId;
  const result = await main_playlist(playlistId);
  res.status(200).type('application/json').send(JSON.stringify(result, null, 2));
});

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

app.get('/status/ok', async (req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get('/status/ping', async (req: Request, res: Response) => {
  const url = 'https://shiroko.fly.dev/status/';

  const results = [];
  for (let i = 0; i < 3; i++) {
    const ts_begin = Date.now();
    const resp = await fetch(url, {
      agent: function (_parsedURL) {
        if (_parsedURL.protocol == 'http:') {
          return httpAgent;
        } else {
          return httpsAgent;
        }
      }
    });
    const ts_end = Date.now();
    const ts_delta = ts_end - ts_begin;
    console.log(`request ${i}: ${ts_delta}ms`);
    results.push(ts_delta);
  }

  res.status(200).type('application/json').send(JSON.stringify(results, null, 2));
});

const credentials = {
  accessKeyId: 'lbf5pnue0i4uuuvc2a7j',
  secretAccessKey: 'cqrx2jkkoe5y5xdez9zniuzc649jz9f5nkn5envl'
};

const rds = new MyClient({
  endpoint: `https://shiroko.fly.dev/runtime/dataapi/api`,
  credentials
});

app.get('/status/rds', async (req: Request, res: Response) => {
  const results = [];
  for (let i = 0; i < 3; i++) {
    const ts_begin = Date.now();

    const command = new ExecuteStatementCommand({
      resourceArn: 'sample-resourceArn',
      secretArn: 'sample-secretArn',
      database: 'sample-database',
      sql: 'select $1::integer + $2::integer',
      parameters: [
        {
          name: 'a',
          value: { longValue: 1 }
        },
        {
          name: 'b',
          value: { longValue: 20 }
        }
      ]
    });
    const result = await rds.send(command);

    const ts_end = Date.now();
    const ts_delta = ts_end - ts_begin;
    console.log(`request ${i}: ${ts_delta}ms`);
    results.push({ idx: i, ts_delta, result });
  }

  res.status(200).type('application/json').send(JSON.stringify(results, null, 2));
});
