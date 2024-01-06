import { Kysely, RawBuilder, sql } from "kysely";
import ytpl from "ytpl";
import { PlaylistModel } from "../models.js";
import { DB } from "../tables/codegen.js";

const toJson = <T>(obj: T): RawBuilder<T> => sql`${JSON.stringify(obj)}`;

export class PlaylistRepository {
  constructor(private readonly db: Kysely<DB>) {}

  async findByNaiveId(naiveId: string): Promise<PlaylistModel | undefined> {
    const found = await this.db
      .selectFrom("playlist")
      .selectAll()
      .where("naiveId", "=", naiveId)
      .executeTakeFirst();
    return found;
  }

  async findAll(): Promise<PlaylistModel[]> {
    const founds = await this.db
      .selectFrom("playlist")
      .selectAll()
      .limit(100)
      .execute();
    return founds;
  }

  async deleteByNaiveId(naiveId: string) {
    const result = await this.db
      .deleteFrom("playlist")
      .where("naiveId", "=", naiveId)
      .execute();
    return result;
  }

  async synchronize(data: ytpl.Result) {
    const playlistId = data.id;
    const prev = await this.findByNaiveId(playlistId);

    const input = {
      url: data.url,
      title: data.title,
      estimatedItemCount: data.estimatedItemCount,
      views: data.views,
      lastUpdated: data.lastUpdated,
      description: data.description,
      visibility: data.visibility,
      payload: toJson(data),
    } as const;

    const fn_update = async () => {
      const result = await this.db
        .updateTable("playlist")
        .where("naiveId", "=", playlistId)
        .set({ ...input })
        .executeTakeFirst();
      return result;
    };

    const fn_insert = async () => {
      const result = await this.db
        .insertInto("playlist")
        .values({
          naiveId: playlistId,
          ...input,
        })
        .executeTakeFirst();
      return result;
    };

    if (!prev) {
      const result = await fn_insert();
      const id = Number(result.insertId);
      return id;
    }

    if (prev.lastUpdated === data.lastUpdated) {
      return prev.id;
    }

    await fn_update();
    return prev.id;
  }
}
