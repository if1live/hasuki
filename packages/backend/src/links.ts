// from react-player source
const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;

export const parseYouTubeUrl = (url: string) => {
  const m = url.match(MATCH_URL_YOUTUBE);
  if (!m) {
    return undefined;
  }

  const obj = new URL(url);
  const params = new URLSearchParams(obj.search);

  const videoId = params.get("v") ?? undefined;
  const playlistId = params.get("list") ?? undefined;

  return {
    videoId,
    playlistId,
  };
};
