import assert from "node:assert/strict";
import {
  Generated,
  Kysely,
  ParseJSONResultsPlugin,
  RawBuilder,
  SqliteAdapter,
  sql,
} from "kysely";
import { afterAll, beforeAll, describe, it } from "vitest";
import { selectDialect } from "../../src/instances/rdbms.js";
import { Timestamp } from "../../src/tables/index.js";

/**
 * json example
 * @link https://github.com/kysely-org/kysely/blob/0.26.1/test/node/src/json.test.ts
 */
interface JsonTable {
  id: Generated<number>;
  data_notnull: object;
  data_nullable: object | null;
}
const JsonTable = {
  async prepare(db: Kysely<Database>) {
    await db.schema
      .createTable("json")
      .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
      .addColumn("data_notnull", "json", (col) => col.notNull())
      .addColumn("data_nullable", "json")
      .execute();
  },
};

interface User {
  id: Generated<number>;
  name: string;
}
const User = {
  async prepare(db: Kysely<Database>) {
    await db.schema
      .createTable("user")
      .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
      .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
      .execute();
  },
};

interface Article {
  id: Generated<number>;
  title: string;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}
const Article = {
  async prepare(db: Kysely<Database>) {
    await db.schema
      .createTable("article")
      .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
      .addColumn("title", "varchar(255)", (col) => col.notNull().unique())
      .addColumn("created_at", "datetime(6)", (col) =>
        col.defaultTo(sql`current_timestamp`).notNull(),
      )
      .addColumn("updated_at", "datetime(6)", (col) =>
        // TODO: sqlite에서는 updated_at을 trigger로 구현해야 한다.
        // 이렇게까지 하고싶진 않아서 전체 스펙을 구현하진 않는다.
        col
          .defaultTo(sql`current_timestamp`)
          .notNull(),
      )
      .execute();
  },
};

interface Database {
  user: User;
  article: Article;
  json: JsonTable;
}

describe("rdbms", async () => {
  const dialect = await selectDialect()();
  // 플러그인으로 테스트 꺠지는거 피하려고 직접 객체 만듬
  const db = new Kysely<Database>({
    dialect,
    plugins: [new ParseJSONResultsPlugin()],
  });

  beforeAll(async () => {});

  afterAll(async () => {
    await db.destroy();
  });

  describe("core", () => {
    it("sqlite", () => {
      const adapter = db.getExecutor().adapter;
      assert.ok(adapter instanceof SqliteAdapter === true);
    });
  });

  describe("simple", () => {
    beforeAll(async () => User.prepare(db));
    afterAll(async () => db.schema.dropTable("user").execute());

    it("insert", async () => {
      await db
        .insertInto("user")
        .values([{ name: "foo" }, { name: "bar" }])
        .execute();
    });

    it("find all", async () => {
      const founds = await db.selectFrom("user").selectAll().execute();
      assert.equal(founds.length, 2);
    });

    it("find: foo", async () => {
      const found_foo = await db
        .selectFrom("user")
        .where("name", "=", "foo")
        .selectAll()
        .executeTakeFirstOrThrow();

      assert.equal(found_foo.name, "foo");
    });
  });

  describe("json", () => {
    beforeAll(async () => JsonTable.prepare(db));
    afterAll(async () => db.schema.dropTable("json").execute());

    it("insert", async () => {
      const toJson = <T>(obj: T): RawBuilder<T> => sql`${JSON.stringify(obj)}`;

      // JSON.stringify() 거치지 않으면 에러 발생
      // TypeError [Error]: SQLite3 can only bind numbers, strings, bigints, buffers, and null
      await db
        .insertInto("json")
        .values({
          data_notnull: toJson(["a"]),
          data_nullable: null,
        })
        .execute();
    });

    it("find all", async () => {
      const found = await db
        .selectFrom("json")
        .selectAll()
        .executeTakeFirstOrThrow();
      assert.deepEqual(found.data_notnull, ["a"]);
      assert.equal(found.data_nullable, null);
    });
  });

  describe("datetime", () => {
    beforeAll(async () => Article.prepare(db));
    afterAll(async () => db.schema.dropTable("article").execute());

    it("insert + select", async () => {
      await db
        .insertInto("article")
        .values({
          title: "foo",
        })
        .execute();

      const found = await db
        .selectFrom("article")
        .selectAll()
        .executeTakeFirstOrThrow();
      assert.equal(found.created_at, found.updated_at);
      assert.equal(typeof found.created_at === "string", true);
    });
  });

  describe("raw query", () => {
    it("ok", async () => {
      type Row = { v: number };
      const compiledQuery =
        sql<Row>`select 1+2 as v, datetime('now') as now`.compile(db);
      const output = await db.executeQuery(compiledQuery);
      assert.equal(output.rows[0]?.v, 3);
    });
  });
});
