import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { audioRoot, playlistRoot, statusRoot } from "./controllers/index.js";
import { engine } from "./instances/misc.js";
import { livereloadMiddleware } from "./middlewares.js";
import * as settings from "./settings.js";

export const app = new Hono();

app.use("*", logger());
app.get("*", prettyJSON());
app.use("*", compress());
app.use("*", cors());

app.use("/static/*", serveStatic({ root: "./" }));

// livereload는 개발 환경에서만 살아있도록 하고싶다
// 번들링에서도 명시적으로 제외하고 싶다
if (settings.NODE_ENV === "development") {
  app.use("*", livereloadMiddleware());
}

app.route(statusRoot.prefix, statusRoot.app);
app.route(playlistRoot.prefix, playlistRoot.app);
app.route(audioRoot.prefix, audioRoot.app);

app.get("/", async (c) => {
  const html = await engine.renderFileSync("index");
  return c.html(html);
});
