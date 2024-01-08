import YouTube from "youtube-sr";

/*
TODO: host?
TODO: 로컬 개발 서버 필요하면 추가
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
};
const host = selectHost(window.location);
*/

export const fetcher_playlist = async (...args: string[]) => {
  const [id, ...rest] = args;
  const url = `https://www.youtube.com/playlist?list=${id}`;
  // TODO: pagination은 고려 안한다
  const playlist = await YouTube.getPlaylist(url, { limit: 200 });
  return playlist;
};

export const fetcher_audio = async (...args: string[]) => {
  const [id, ...rest] = args;
  const url = `https://www.youtube.com/watch?v=${id}`;
  const video = await YouTube.getVideo(url);
  return video;
};
