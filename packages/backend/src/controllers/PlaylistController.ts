import { Context, Hono } from "hono";
import * as R from "remeda";
import ytpl from "ytpl";
import * as z from "zod";
import { engine } from "../instances/index.js";
import { db } from "../instances/rdbms.js";
import { parseYouTubeUrl } from "../links.js";
import { PlaylistItemModel, PlaylistModel } from "../models.js";
import {
  PlaylistItemRepository,
  PlaylistRepository,
} from "../repositories/index.js";
import * as settings from "../settings.js";

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

interface ViewOutput {
  playlistId: string;
  playlist: PlaylistModel | undefined;
  items: PlaylistItemModel[];
}

const fn_view = async (c: Context, playlistId: string): Promise<ViewOutput> => {
  const repo_playlist = new PlaylistRepository(db);
  const playlist = await repo_playlist.findByNaiveId(playlistId);

  const fn_find = async (playlist: PlaylistModel) => {
    const repo_item = new PlaylistItemRepository(db);
    const items = await repo_item.findManyByPlaylistId(playlist.id);
    return items;
  };

  const items = playlist ? await fn_find(playlist) : [];

  // thumbnail 선택 전략: 용량 최적화
  for (const item of items) {
    const payload = item.payload as ytpl.Item;
    const image_min = R.minBy(payload.thumbnails, (x) => x.width * x.height);
    const image = image_min ?? payload.bestThumbnail;
    (item as unknown as Record<string, unknown>).thumbnail = image;
  }

  // liquid에서 tojson 쓰려면 필요 없는거 지우는게 좋다
  if (playlist?.payload) {
    playlist.payload = undefined;
  }
  for (const item of items) {
    item.payload = undefined;
    (item as Partial<typeof item>).createdAt = undefined;
    (item as Partial<typeof item>).updatedAt = undefined;
  }

  return {
    playlistId,
    playlist,
    items,
  };
};

const render_view = async (c: Context, ctx: ViewOutput) => {
  const html = await engine.renderFile("playlist_view", ctx);
  return c.html(html);
};

// TODO: frontend와의 통신 규격 관리는 뭐로 하지?
app.get("/api/:playlistId/", async (c) => {
  const playlistId = c.req.param("playlistId");
  const model = await fn_view(c, playlistId);
  return c.json(model);
});

app.get("/redirect/", async (c) => {
  const schema = z.object({
    action: z.union([z.literal("inspect"), z.literal("player")]),
    playlistId: z.string().optional(),
    videoId: z.string().optional(),
    url: z.string().optional(),
  });
  const body = schema.parse(c.req.query());
  const { action } = body;

  let playlistId = body.playlistId;
  let videoId = body.videoId;
  if (body.url) {
    const parsed = parseYouTubeUrl(body.url);
    if (parsed) {
      playlistId = parsed.playlistId;
      videoId = parsed.videoId;
    }
  }

  if (playlistId) {
    switch (action) {
      case "inspect": {
        const nextUrl = `/playlist/${playlistId}/`;
        return c.redirect(nextUrl);
      }
      case "player": {
        const nextUrl = `${settings.FRONTEND_URL}/?playlist=${playlistId}`;
        return c.redirect(nextUrl);
      }
    }
  }

  if (videoId) {
    switch (action) {
      case "inspect":
        // TODO:
        break;
      case "player": {
        const nextUrl = `${settings.FRONTEND_URL}/?video=${videoId}`;
        return c.redirect(nextUrl);
      }
    }
  }

  // else...
  return c.redirect("/playlist/");
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
  const output = await fn_view(c, playlistId);
  return await render_view(c, output);
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

  // TODO: player url
  for (const playlist of playlists) {
    const url = `${settings.FRONTEND_URL}/?playlist=${playlist.naiveId}`;
    (playlist as unknown as Record<string, string>).playerUrl = url;
  }

  const html = await engine.renderFile("playlist_list", {
    playlists,
  });
  return c.html(html);
});

export const playlistRoot = {
  prefix: "/playlist",
  app,
} as const;
