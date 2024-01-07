import assert from "node:assert/strict";
import { afterAll, describe, it } from "vitest";
import { redis } from "../../src/instances/redis.js";

describe("TestRedis", async () => {
  describe("simple", () => {
    const key = "foo";

    afterAll(async () => {
      await redis.del(key);
    });

    it("scenario", async () => {
      await redis.set(key, 1);
      const found = await redis.get(key);
      assert.equal(found, "1");
    });
  });
});
