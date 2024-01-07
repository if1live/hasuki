import { assert, describe, it } from "vitest";
import { parseYouTubeUrl } from "../src/links.js";

describe("parseYouTubeUrl", () => {
  it("video", () => {
    const url = "https://www.youtube.com/watch?v=WIqrKvfEJos";
    const parsed = parseYouTubeUrl(url);
    assert.deepEqual(parsed?.videoId, "WIqrKvfEJos");
    assert.deepEqual(parsed?.playlistId, undefined);
  });

  it("video + playlist", () => {
    const url =
      "https://www.youtube.com/watch?v=xtYrERoq_W8&list=PL00AC37838000513F";
    const parsed = parseYouTubeUrl(url);
    assert.deepEqual(parsed?.videoId, "xtYrERoq_W8");
    assert.deepEqual(parsed?.playlistId, "PL00AC37838000513F");
  });

  it("playlist", () => {
    const url = "https://www.youtube.com/playlist?list=PL0B01335F8E6D9F69";
    const parsed = parseYouTubeUrl(url);
    assert.deepEqual(parsed?.videoId, undefined);
    assert.deepEqual(parsed?.playlistId, "PL0B01335F8E6D9F69");
  });

  it("not youtube", () => {
    const url = "https://google.com";
    const parsed = parseYouTubeUrl(url);
    assert.deepEqual(parsed, undefined);
  });
});
