import type { VercelRequest, VercelResponse } from "@vercel/node";
import { YouTube } from "youtube-sr";
import { z } from "zod";

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
}

const fn_playlist = async (id: string) => {
  const url = `https://www.youtube.com/playlist?list=${id}`;
  const playlist = await YouTube.getPlaylist(url, { fetchAll: true });
  return playlist;
};

const fn_video = async (id: string) => {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const video = await YouTube.getVideo(url);
  return video;
};
