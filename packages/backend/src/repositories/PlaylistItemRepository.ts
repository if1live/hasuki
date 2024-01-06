import { Insertable, Kysely, RawBuilder, sql } from "kysely";
import ytpl from "ytpl";
import { PlaylistItemModel } from "../models.js";
import { DB, PlaylistItem } from "../tables/codegen.js";

const toJson = <T>(obj: T): RawBuilder<T> => sql`${JSON.stringify(obj)}`;

export class PlaylistItemRepository {
  constructor(private readonly db: Kysely<DB>) {}

  async findManyByPlaylistId(playlistId: number): Promise<PlaylistItemModel[]> {
    const founds = await this.db
      .selectFrom("playlistItem")
      .selectAll()
      .where("playlistId", "=", playlistId)
      .orderBy("index")
      .execute();
    return founds;
  }

  async deleteByPlaylistId(playlistId: number) {
    const result = await this.db
      .deleteFrom("playlistItem")
      .where("playlistId", "=", playlistId)
      .executeTakeFirst();
    return result;
  }

  // TODO: 머리 쓰기 귀찮아서 통쨰로 지우고 추가. 나중에 고칠것
  async synchronize(playlistId: number, data: ytpl.Result) {
    await this.deleteByPlaylistId(playlistId);

    const items = data.items.map((item): Insertable<PlaylistItem> => {
      const duration = item.duration ?? "0:00";
      const durationSec = item.durationSec ?? 0;

      const record_number = item as unknown as Record<string, number>;
      const isLive = record_number.isLive ?? 0;
      const isPlayable = record_number.isPlayable ?? 0;

      return {
        playlistId,
        title: item.title,
        index: item.index,
        naiveId: item.id,
        shortUrl: item.shortUrl,
        url: item.url,
        isLive,
        duration,
        durationSec,
        isPlayable,
        payload: toJson(item),
      };
    });

    const result = await this.db
      .insertInto("playlistItem")
      .values(items)
      .executeTakeFirst();
    return result;
  }
}
