import { Hono } from "hono";
import { redis } from "../instances/index.js";
import { AudioService } from "../services/AudioService.js";

const app = new Hono();

app.get("/api/:videoId/", async (c) => {
  const videoId = c.req.param("videoId");
  const s = new AudioService(redis);
  const model = await s.load(videoId);
  return c.json(model);
});

app.post("/api/:videoId/delete", async (c) => {
  const videoId = c.req.param("videoId");
  const s = new AudioService(redis);
  const result = await s.del(videoId);
  return c.json(result);
});

export const audioRoot = {
  prefix: "/audio",
  app,
} as const;
