export enum LinkType {
  None,
  YouTube,
  SoundCloud,
}

// from react-player source
const YT_MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
const SC_MATCH_URL = /(soundcloud\.com|snd\.sc)\/.+$/;

const table: Array<[RegExp, LinkType]> = [
  [YT_MATCH_URL, LinkType.YouTube],
  [SC_MATCH_URL, LinkType.SoundCloud],
];

export const getLinkType = (url: string) => {
  for (const pair of table) {
    const re = pair[0];
    const ty = pair[1];
    if (url.match(re)) {
      return ty;
    }
  }
  return LinkType.None;
};

export const getYouTubeVideoId = (url: string) => {
  const m = url.match(YT_MATCH_URL);
  return m ? m[1] : undefined;
};

