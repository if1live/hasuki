import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { fetch_playlist, fetch_video } from "../src/apis.js";

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
        const result = await fetch_playlist(id);
        return response.status(200).json(result);
      }
      case "video": {
        const result = await fetch_video(id);
        return response.status(200).json(result);
      }
    }
  } catch (error) {
    return response.status(400).json(error);
  }
}
