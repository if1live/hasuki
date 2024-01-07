// TODO: host?
const host = "http://127.0.0.1:3000";

// TODO: 타입 정의 노가다? monorepo로 분리?
export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface PlaylistItem {
  id: number;
  playlistId: number;
  title: string;
  index: number;
  naiveId: string;
  shortUrl: string;
  url: string;
  duration: string;
  durationSec: number;
  thumbnail: Thumbnail;
}

export interface Playlist {
  id: number;
  naiveId: string;
  url: string;
  title: string;
  description: string;
  visibility: string;
}

export interface PlaylistSnapshot {
  playlistId: string;
  playlist: Playlist;
  items: PlaylistItem[];
}

export interface AudioFormat {
  url: string;
  mimeType: string;
  audioQuality: string;
  audioBitrate: number;
}

export interface VideoDetails {
  lengthSeconds: string;
  thumbnails: Thumbnail[];
  title: string;
  videoId: string;
}

export interface AudioSnapshot {
  formats: AudioFormat[];
  videoDetails: VideoDetails;
}

export const fetcher_playlist = async (
  ...args: string[]
): Promise<PlaylistSnapshot> => {
  const [id, ...rest] = args;
  const url = `${host}/playlist/api/${id}/`;
  const res = await fetch(url);
  return await res.json();
};

export const fetcher_audio = async (
  ...args: string[]
): Promise<AudioSnapshot> => {
  const [id, ...rest] = args;
  const url = `${host}/audio/api/${id}/`;
  const res = await fetch(url);
  return await res.json();
};
