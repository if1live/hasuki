import * as YouTube from "youtube-sr";
import { Playlist, parse_playlist, parse_video } from "./types.js";

export const fetch_playlist = async (
  id: string,
): Promise<{ playlist: Playlist }> => {
  const url = `https://www.youtube.com/playlist?list=${id}`;
  const playlist = await YouTube.YouTube.getPlaylist(url, { fetchAll: true });
  const parsed = parse_playlist(playlist);
  return {
    playlist: parsed,
  };
};

export const fetch_video = async (
  id: string,
): Promise<{
  playlist: Playlist;
  adaptiveFormats: YouTube.VideoStreamingFormatAdaptive[];
  formats: YouTube.VideoStreamingFormat[];
}> => {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const video = await YouTube.YouTube.getVideo(url);
  const parsed = parse_video(video);
  return {
    playlist: parsed.playlist,
    adaptiveFormats: parsed.adaptiveFormats,
    formats: parsed.formats,
  };
};
