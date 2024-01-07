// TODO: host?

const selectHost = (loc: Location) => {
  const hosts_localhost = ["localhost", "127.0.0.1"];
  if (hosts_localhost.includes(loc.hostname)) {
    return "http://localhost:3000";
  }

  if (loc.host.startsWith("192.168.")) {
    return `http://${loc.hostname}:3000`;
  }
  if (loc.host.startsWith("10.0.")) {
    return `http://${loc.hostname}:3000`;
  }

  // TODO: 배포 환경?
  return "https://6z45tn65jrowivqzwvcgmxdno40gmwqp.lambda-url.ap-northeast-1.on.aws";
};
const host = selectHost(window.location);

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
  audioQuality: "AUDIO_QUALITY_MEDIUM" | "AUDIO_QUALITY_LOW";
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
