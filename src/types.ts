import * as YouTube from "youtube-sr";
import { z } from "zod";

// youtube-sr 의 타입을 그대로 쓰기에는 question mark 가 많다
// zod 처리하고 원하는 데이터만 갖고다니자
export const Thumbnail = z.object({
  width: z.number(),
  height: z.number(),
  url: z.string().nullable(),
});
export type Thumbnail = z.infer<typeof Thumbnail>;

export const Channel = z.object({
  name: z.string().optional(),
  id: z.string().optional(),
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
  fake: z.boolean(),
  mix: z.boolean().optional(),
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
    fake: data.fake,
    mix: data.mix,
  });
};

export const parse_video = (
  data: YouTube.Video,
): {
  playlist: Playlist;
  adaptiveFormats: YouTube.VideoStreamingFormatAdaptive[];
  formats: YouTube.VideoStreamingFormat[];
} => {
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

  const playlist = Playlist.parse({
    id: "",
    title: "",
    thumbnail: data.thumbnail,
    channel: data.channel,
    url: data.url,
    videos,
  });

  return {
    playlist,
    formats: data.formats,
    adaptiveFormats: data.adaptiveFormats,
  };
};

export const playerTag_plain = "plain";
export const playerTag_music = "music";
export type PlayerTag = typeof playerTag_plain | typeof playerTag_music;
