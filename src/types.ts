import * as YouTube from "youtube-sr";
import { z } from "zod";

// youtube-sr 의 타입을 그대로 쓰기에는 question mark 가 많다
// zod 처리하고 원하는 데이터만 갖고다니자
export const Thumbnail = z.object({
  width: z.number().default(0),
  height: z.number().default(0),
  url: z.string().nullable(),
});
export type Thumbnail = z.infer<typeof Thumbnail>;

export const Channel = z.object({
  name: z.string().optional(),
  id: z.string().optional(),
});
export type Channel = z.infer<typeof Channel>;

export const Video = z.object({
  provider: z.union([z.literal("yt"), z.literal("sc")]),
  id: z.string(),
  url: z.string(),
  title: z.string(),
  duration: z.number(),
  durationFormatted: z.string(),
  thumbnail: Thumbnail,
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

// 필드를 undefined로 받아도 되지만 연결은 반드시 해야되도록
type MyPartial<T> = {
  [P in keyof T]: T[P] | undefined;
};

const cast_thumbnail = (data: YouTube.Thumbnail | undefined): Thumbnail => {
  const input: MyPartial<Thumbnail> = {
    height: data?.height,
    width: data?.width,
    url: data?.url,
  };
  return Thumbnail.parse(input);
};

const cast_video = (data: YouTube.Video): Video => {
  const next: MyPartial<Video> = {
    provider: "yt",
    id: data.id,
    url: data.url,
    title: data.title,
    duration: data.duration,
    durationFormatted: data.durationFormatted,
    thumbnail: cast_thumbnail(data.thumbnail),
  };
  return Video.parse(next);
};

export const parse_playlist = (data: YouTube.Playlist): Playlist => {
  const videos = data.videos.map((video) => cast_video(video));

  const next: MyPartial<Playlist> = {
    id: data.id,
    title: data.title,
    thumbnail: cast_thumbnail(data.thumbnail),
    channel: data.channel,
    url: data.url,
    videos,
    fake: data.fake,
    mix: data.mix,
  };
  return Playlist.parse(next);
};

export const parse_video = (
  data: YouTube.Video,
): {
  playlist: Playlist;
  adaptiveFormats: YouTube.VideoStreamingFormatAdaptive[];
  formats: YouTube.VideoStreamingFormat[];
} => {
  const thumbnail = Thumbnail.parse(data.thumbnail);
  const videos = [data].map((video) => cast_video(video));

  const next: MyPartial<Playlist> = {
    id: "",
    title: "",
    thumbnail,
    channel: data.channel,
    url: data.url,
    videos,
    // video를 playlist처럼 취급하면 없는 속성
    fake: true,
    mix: false,
  };
  const playlist = Playlist.parse(next);

  return {
    playlist,
    formats: data.formats,
    adaptiveFormats: data.adaptiveFormats,
  };
};

export const playerTag_plain = "plain";
export const playerTag_music = "music";
export type PlayerTag = typeof playerTag_plain | typeof playerTag_music;
