import { VercelRequest, VercelResponse } from "@vercel/node";
import * as R from "remeda";
import ytdl from "ytdl-core";
import { z } from "zod";

const fetchYouTube = async (videoId: string) => {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const info = await ytdl.getInfo(url);
  return info;
};

// url은 한번 받으면 일정 시간동안 살아있어서 캐싱할수 있다.
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

interface VideoModel {
  formats: ReturnType<typeof pick_format>[];
  videoDetails: ReturnType<typeof pick_videoDetails>;
}

const VideoModel = {
  from(info: ytdl.videoInfo): VideoModel {
    const formats = R.pipe(info.formats, R.map(pick_format));

    return {
      formats,
      videoDetails: pick_videoDetails(info.videoDetails),
    };
  },
};

export class VideoService {
  async load_immediate(videoId: string): Promise<VideoModel | null> {
    const info = await fetchYouTube(videoId);
    const model = VideoModel.from(info);
    return model;
  }

  async load(videoId: string): Promise<VideoModel | null> {
    const model_immediate = await this.load_immediate(videoId);
    return model_immediate;
  }
}

const schema = z.object({
  id: z.string(),
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const input = schema.safeParse(request.query);
  if (input.success === false) {
    const { error } = input;
    return response.status(400).json(error);
  }

  const { id } = input.data;
  const s = new VideoService();
  const data = await s.load(id);
  return response.status(200).json(data);
}
