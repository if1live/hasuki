import express from "express";
import asyncify from "express-asyncify";
import { engine } from "./instances.js";
import * as settings from "./settings.js";

export const app: express.Application = asyncify(express());

app.engine("liquid", engine.express());
app.set("views", "./views");
app.set("view engine", "liquid");

/*
// livereload는 개발 환경에서만 살아있도록 하고싶다
// 번들링에서도 명시적으로 제외하고 싶다
if (settings.NODE_ENV === "development") {
  const { default: livereloadMiddleware } = await import("connect-livereload");
  app.use(livereloadMiddleware());
}
*/

app.get("/", async (req, res) => {
  res.render("index", { name: "foo1" });
});
