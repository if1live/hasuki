import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { fetch_playlist, fetch_video } from "../src/apis.js";

const schema = z.object({
  action: z.enum(["playlist", "video"]),
});

const schema_playlist = z.object({
  list: z.string(),
  v: z.string().optional(),
});

const schema_video = z.object({
  v: z.string(),
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
    const { action } = input.data;
    switch (action) {
      case "playlist": {
        const req = schema_playlist.parse(request.query);
        const result = await fetch_playlist(req.list, req.v);
        return response.status(200).json(result);
      }
      case "video": {
        const req = schema_video.parse(request.query);
        const result = await fetch_video(req.v);
        return response.status(200).json(result);
      }
    }
  } catch (error) {
    console.error(error);
    return response.status(400).json(error);
  }
}
