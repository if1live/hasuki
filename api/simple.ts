import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as YouTube from "youtube-sr";
import { z } from "zod";
import { Playlist, parse_playlist, parse_video } from "../src/types.js";

const schema = z.object({
  action: z.enum(["playlist", "video"]),
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

  try {
    const { action, id } = input.data;
    switch (action) {
      case "playlist": {
        const result = await fn_playlist(id);
        return response.status(200).json(result);
      }
      case "video": {
        const result = await fn_video(id);
        return response.status(200).json(result);
      }
    }
  } catch (error) {
    return response.status(400).json(error);
  }
}

const fn_playlist = async (id: string): Promise<{ playlist: Playlist }> => {
  const url = `https://www.youtube.com/playlist?list=${id}`;
  const playlist = await YouTube.YouTube.getPlaylist(url, { fetchAll: true });
  const parsed = parse_playlist(playlist);
  return {
    playlist: parsed,
  };
};

const fn_video = async (
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
