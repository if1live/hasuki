import { assert, describe, it } from "vitest";
import { parseYouTubeUrl } from "../src/links.js";

describe("parseYouTubeUrl", () => {
  it("video", () => {
    const url = "https://www.youtube.com/watch?v=WIqrKvfEJos";
    const parsed = parseYouTubeUrl(url);
    assert.strictEqual(parsed?.videoId, "WIqrKvfEJos");
    assert.strictEqual(parsed?.playlistId, undefined);
  });

  it("video + playlist", () => {
    const url =
      "https://www.youtube.com/watch?v=xtYrERoq_W8&list=PL00AC37838000513F";
    const parsed = parseYouTubeUrl(url);
    assert.strictEqual(parsed?.videoId, "xtYrERoq_W8");
    assert.strictEqual(parsed?.playlistId, "PL00AC37838000513F");
  });

  it("playlist", () => {
    const url = "https://www.youtube.com/playlist?list=PL0B01335F8E6D9F69";
    const parsed = parseYouTubeUrl(url);
    assert.strictEqual(parsed?.videoId, undefined);
    assert.strictEqual(parsed?.playlistId, "PL0B01335F8E6D9F69");
  });

  it("not youtube", () => {
    const url = "https://google.com";
    const parsed = parseYouTubeUrl(url);
    assert.strictEqual(parsed, undefined);
  });

  it("youtu.be", () => {
    const url = "https://youtu.be/UnfLmHQUaLc?si=b55oJuGBM7og1hcA";
    const parsed = parseYouTubeUrl(url);
    assert.strictEqual(parsed?.videoId, "UnfLmHQUaLc");
    assert.strictEqual(parsed?.playlistId, undefined);
  });

  it('youtube mix', () => {
    const url = 'https://www.youtube.com/watch?v=oP_E9entrGU&list=RDoP_E9entrGU&start_radio=1';
    const parsed = parseYouTubeUrl(url);
    assert.strictEqual(parsed?.videoId, 'oP_E9entrGU');
    assert.strictEqual(parsed?.playlistId, 'RDoP_E9entrGU');
  })
});
