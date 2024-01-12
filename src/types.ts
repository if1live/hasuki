import * as YouTube from "youtube-sr";
import { z } from "zod";

// youtube-sr 의 타입을 그대로 쓰기에는 question mark 가 많다
// zod 처리하고 원하는 데이터만 갖고다니자
export const Thumbnail = z.object({
  width: z.number(),
  height: z.number(),
  url: z.string(),
});
export type Thumbnail = z.infer<typeof Thumbnail>;

export const Channel = z.object({
  name: z.string(),
  id: z.string(),
});
export type Channel = z.infer<typeof Channel>;

export const Video = z.object({
  id: z.string(),
  url: z.string(),
  shortsUrl: z.string(),
  title: z.string(),
  duration: z.number(),
  durationFormatted: z.string(),
  thumbnail: Thumbnail,
  channel: Channel,
});
export type Video = z.infer<typeof Video>;

export const Playlist = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: Thumbnail,
  channel: Channel,
  url: z.string(),
  videos: z.array(Video),
});
export type Playlist = z.infer<typeof Playlist>;

export const parse_playlist = (data: YouTube.Playlist): Playlist => {
  const videos = data.videos.map((video) => {
    return {
      id: video.id,
      url: video.url,
      shortsUrl: video.shortsURL,
      title: video.title,
      duration: video.duration,
      durationFormatted: video.durationFormatted,
      thumbnail: video.thumbnail,
      channel: video.channel,
    };
  });

  return Playlist.parse({
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    channel: data.channel,
    url: data.url,
    videos,
  });
};

export const parse_video = (data: YouTube.Video): Playlist => {
  const videos = [data].map((video) => {
    return {
      id: video.id,
      url: video.url,
      shortsUrl: video.shortsURL,
      title: video.title,
      duration: video.duration,
      durationFormatted: video.durationFormatted,
      thumbnail: video.thumbnail,
      channel: video.channel,
    };
  });

  return Playlist.parse({
    id: "",
    title: data.title,
    thumbnail: data.thumbnail,
    channel: data.channel,
    url: data.url,
    videos,
  });
};
