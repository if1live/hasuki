import { Hono } from "hono";
import { sql } from "kysely";
import { engine } from "../instances/misc.js";
import { db } from "../instances/rdbms.js";

const app = new Hono();

app.get("/", async (c) => {
  type Row = { v: number };
  const compiledQuery = sql<Row>`select 1+2 as v`.compile(db);
  const output = await db.executeQuery(compiledQuery);

  const html = await engine.renderFileSync("index", {
    name: "sample",
    data: output,
  });
  return c.html(html);
});

export const statusRoot = {
  prefix: "/status",
  app,
} as const;
