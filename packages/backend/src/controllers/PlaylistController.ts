import { Context, Hono } from "hono";
import * as R from "remeda";
import ytpl from "ytpl";
import * as z from "zod";
import { engine } from "../instances/index.js";
import { db } from "../instances/rdbms.js";
import { PlaylistModel } from "../models.js";
import {
  PlaylistItemRepository,
  PlaylistRepository,
} from "../repositories/index.js";

const app = new Hono();

const fn_synchronize = async (c: Context, playlistId: string) => {
  // 가공 없이 통으로 넘기기. 데이터 가공은 밖에서 수행
  const data = await ytpl(playlistId, { pages: 100 });

  const repo_playlist = new PlaylistRepository(db);
  const id = await repo_playlist.synchronize(data);

  const repo_item = new PlaylistItemRepository(db);
  const result_item = await repo_item.synchronize(id, data);

  const nextUrl = `/playlist/${playlistId}/`;
  return c.redirect(nextUrl);
};

const fn_delete = async (c: Context, playlistId: string) => {
  const repo_playlist = new PlaylistRepository(db);
  const playlist = await repo_playlist.findByNaiveId(playlistId);

  if (playlist) {
    await repo_playlist.deleteByNaiveId(playlistId);

    const repo_item = new PlaylistItemRepository(db);
    await repo_item.deleteByPlaylistId(playlist.id);
  }

  const nextUrl = `/playlist/${playlistId}/`;
  return c.redirect(nextUrl);
};

const fn_view = async (c: Context, playlistId: string) => {
  const repo_playlist = new PlaylistRepository(db);
  const playlist = await repo_playlist.findByNaiveId(playlistId);

  const fn_find = async (playlist: PlaylistModel) => {
    const repo_item = new PlaylistItemRepository(db);
    const items = await repo_item.findManyByPlaylistId(playlist.id);
    return items;
  };

  const items = playlist ? await fn_find(playlist) : [];

  // liquid에서 tojson 쓰려면 필요 없는거 지우는게 좋다
  if (playlist?.payload) {
    playlist.payload = undefined;
  }

  // thumbnail 선택 전략: 용량 최적화
  for (const item of items) {
    const payload = item.payload as ytpl.Item;
    const image_min = R.minBy(payload.thumbnails, (x) => x.width * x.height);
    const image = image_min ?? payload.bestThumbnail;
    (item as unknown as Record<string, unknown>).thumbnail = image;
  }

  const html = await engine.renderFile("playlist_view", {
    playlistId,
    playlist,
    items,
  });
  return c.html(html);
};

app.get("/view/", async (c) => {
  const schema = z.object({
    naiveId: z.string(),
  });
  const input = schema.parse(c.req.query());

  const { naiveId } = input;
  return await fn_view(c, naiveId);
});

app.post("/synchronize/", async (c) => {
  const schema = z.object({
    playlistId: z.string(),
  });

  const body = await c.req.parseBody();
  const input = schema.parse(body);

  const { playlistId } = input;
  return await fn_synchronize(c, playlistId);
});

app.post("/delete/", async (c) => {
  const schema = z.object({
    playlistId: z.string(),
  });

  const body = await c.req.parseBody();
  const input = schema.parse(body);

  const { playlistId } = input;
  return await fn_delete(c, playlistId);
});

app.get("/:playlistId/", async (c) => {
  const playlistId = c.req.param("playlistId");
  return await fn_view(c, playlistId);
});

app.post("/:playlistId/synchronize", async (c) => {
  const playlistId = c.req.param("playlistId");
  return await fn_synchronize(c, playlistId);
});

app.post("/:playlistId/delete", async (c) => {
  const playlistId = c.req.param("playlistId");
  return await fn_delete(c, playlistId);
});

app.get("*", async (c) => {
  // TODO: 플레이리스트 전체 목록
  // 개인용이면 어차피 몇개 안될거니까
  const repo = new PlaylistRepository(db);
  const playlists = await repo.findAll();

  const html = await engine.renderFile("playlist_list", {
    playlists,
  });
  return c.html(html);
});

export const playlistRoot = {
  prefix: "/playlist",
  app,
} as const;
