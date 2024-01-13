import * as YouTubePkg from "youtube-sr";
import { YouTube } from "youtube-sr";
import { Playlist, parse_playlist, parse_video } from "./types.js";

export const fetch_playlist = async (
  id: string,
): Promise<{ playlist: Playlist }> => {
  // Mixes are playlists Youtube makes for you
  // https://www.youtube.com/playlist?list=${id}
  // 규격으로 플레이리스트 요청할 경우, youtube-sr로는 믹스를 읽을 수 없다.
  // 테스트된 예제 RD8FNRWu58ohk, https://www.youtube.com/playlist?list=RD8FNRWu58ohk
  // '/playlist' 대신 '/watch' 쓰면 요청 작동하는거 확인
  const url = `https://www.youtube.com/watch?list=${id}`;
  const playlist = await YouTube.getPlaylist(url, {
    fetchAll: true,
  });
  const parsed = parse_playlist(playlist);
  return {
    playlist: parsed,
  };
};

export const fetch_video = async (
  id: string,
): Promise<{
  playlist: Playlist;
  adaptiveFormats: YouTubePkg.VideoStreamingFormatAdaptive[];
  formats: YouTubePkg.VideoStreamingFormat[];
}> => {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const video = await YouTube.getVideo(url);
  const parsed = parse_video(video);
  return {
    playlist: parsed.playlist,
    adaptiveFormats: parsed.adaptiveFormats,
    formats: parsed.formats,
  };
};
