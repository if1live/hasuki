import * as YouTubePkg from "youtube-sr";
import { YouTube } from "youtube-sr";
import { Playlist, parse_playlist, parse_video } from "./types.js";

/*
playlist 삽질 기록

1. playlist ID-prefix가 있다? (거짓)

Gochuumon wa Usagi Desu ka? OST
https://www.youtube.com/playlist?list=PL-tS4i4IHFJj4EOQjXEglBX9DLOT4hfS4
대부분의 playlist는 PL로 시작한다.

Gemini Syndrome
https://www.youtube.com/playlist?list=OLAK5uy_mJLk4rG8mIhZBqRTalI6ZyGkSPc1VyWRM
PL로 시작하지 않는 playlist도 있다.

2. 플레이리스트는 유한한 list (거짓)

Mixes are playlists Youtube makes for you
유튜브 믹스는 끝없이 반복되는데 플레이리스트와 URL로 구분할수 없다.

PC 웹에서 뜯은 URL
https://www.youtube.com/watch?v=8FNRWu58ohk&list=RD8FNRWu58ohk&start_radio=1
URL은 /watch
list는 믹스용 playlist id
v는 어떤 곡부터 재생할지. 사실상 seed로 사용되는 느낌도 있다.
v를 조작했을때 나오는 곡은 순서가 상상한대로 돌아가지 않는다.

모바일 유튜브 플레이에서 뜯은 믹스 URL
https://youtube.com/playlist?list=RD8FNRWu58ohk&playnext=1&si=tts7Xm0LKcMtXC1u
URL은 /playlist
list는 믹스용 playlist id
playnext 에서 사용되는 seed?로 추정. playnext는 1씩 올렸을떄 순서는 상상과 다르다.

mix의 경우는 끝에 도달했을떄 다음 리스트를 읽는 식으로 작동하면 될듯?
*/

type PlaylistFn = (
  playlistId: string,
  videoId: string | undefined,
) => Promise<{ playlist: Playlist }>;

export const fetch_playlist: PlaylistFn = async (playlistId, videoId) => {
  return videoId
    ? fetch_playlist_mix(playlistId, videoId)
    : fetch_playlist_real(playlistId);
};

const fetch_playlist_mix = async (playlistId: string, videoId: string) => {
  const search = new URLSearchParams([
    ["list", playlistId],
    ["v", videoId],
    ["start_radio", "1"],
  ]);
  const url = `https://www.youtube.com/watch?${search}`;
  const playlist = await YouTube.getPlaylist(url, {
    fetchAll: true,
  });
  const parsed = parse_playlist(playlist);
  return {
    playlist: parsed,
  };
};

const fetch_playlist_real = async (playlistId: string) => {
  // 모바일 mix 흉내내는게 pc mix쪽보다 간편해서
  // TOOD: mix의 반복 재생을 흉내낼 방법? 연속 재생하려면 pc처럼 videoId받는게 나을듯?
  const playnext = "1";
  const search = new URLSearchParams([
    ["list", playlistId],
    ["playnext", playnext],
  ]);

  const url = `https://www.youtube.com/playlist?${search}`;
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
  const search = new URLSearchParams([["v", id]]);
  const url = `https://www.youtube.com/watch?${search}`;
  const video = await YouTube.getVideo(url);
  const parsed = parse_video(video);
  return {
    playlist: parsed.playlist,
    adaptiveFormats: parsed.adaptiveFormats,
    formats: parsed.formats,
  };
};
