import { PlaylistItem } from './PlaylistItem';
import { SHEET_ID } from '../settings';
import * as _ from 'lodash';

export const DEFAULT_PLAYLIST_NAME = 'default';

export class Playlist {
  public readonly name: string;
  public readonly items: PlaylistItem[];

  constructor(name: string, items: PlaylistItem[]) {
    this.name = name;
    this.items = [...items];
  }

  public cursorToIndex(cursor: number) {
    const len = this.items.length;
    if (len === 0) {
      return undefined;
    }
    // js는 음수 % 를 하면 음수가 나온다
    const idx = cursor % len;
    const positiveIdx = (idx >= 0)
      ? idx
      : idx + len;
    // -3 % 3 = -0
    // -0 === 0 이긴한테 테스트 코드를 손보긴 싫으니
    // 0으로 나오게 하고싶다
    return Math.abs(positiveIdx);
  }

  public get(cursor: number) {
    const idx = this.cursorToIndex(cursor);
    if (idx === undefined) { return undefined; }
    return this.items[idx];
  }

  public get length() {
    return this.items.length;
  }
}

export const shufflePlaylist = (playlist: Playlist) => {
  const items = _.shuffle([...playlist.items]);
  items.forEach((item, idx) => item.order = idx);
  return new Playlist(playlist.name, items);
};

interface YouTubeThumbnail {
  width: number;
  height: number;
  url: string;
}

interface YouTubeThumbnails {
  standard: YouTubeThumbnail;
  medium: YouTubeThumbnail;
  default: YouTubeThumbnail;
  high: YouTubeThumbnail;
  maxres: YouTubeThumbnail;
}

interface YouTubeContent {
  title: string;
  duration: string;
  thumbnails: YouTubeThumbnails;
}

export const parseDuration = (duration: string) => {
  // PT19S
  // PT3M52S
  // PT1H7M50S
  const re = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const match = duration.match(re);
  if (!match) { return undefined; }

  const h = match[1] ? parseInt(match[1].replace('H', ''), 10) : 0;
  const m = match[2] ? parseInt(match[2].replace('M', ''), 10) : 0;
  const s = match[3] ? parseInt(match[3].replace('S', ''), 10) : 0;
  return h * 3600 + m * 60 + s;
};

class Row {
  private readonly arr: Array<string | undefined>;
  constructor(arr: Array<string | undefined>) {
    this.arr = arr;
  }

  public get url() { return this.arr[0] as string; }
  public get title() { return this.arr[1]; }
  public get group() { return this.arr[2] || ''; }
  public get hidden() { return this.arr[3]; }
  public get content() { return JSON.parse(this.arr[4] || '{}') as YouTubeContent; }
}

const isHidden = (row: Row) => {
  const hidden = row.hidden;
  return (hidden && hidden.length > 0);
};

const makePlaylistItem = (row: Row, order: number): PlaylistItem => {
  const content = row.content;
  const durationStr = content.duration;
  const duration = parseDuration(durationStr);
  const milliseconds = duration ? duration * 1000 : undefined;

  return {
    url: row.url,
    title: row.title,
    group: row.group,
    thumbnail: content.thumbnails.default.url,
    milliseconds,
    order,
  };
};

const fetchSheet = (sheet: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const gapi = window.gapi;
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheet}!A2:F`,
    }).then(
      (response: any) => resolve(response),
      (response: any) => reject(response),
    );
  });
};

export const fetchPlaylist = async (sheet: string) => {
  try {
    const resp = await fetchSheet(sheet);
    const range = resp.result;
    const values = range.values as Array<Array<string | undefined>>;
    const rows = values.map((x) => new Row(x));
    const items = rows
      .filter((x) => !isHidden(x))
      .map(makePlaylistItem);
    const playlist = new Playlist(sheet, items);
    return playlist;

  } catch (err) {
    console.error(err);
    return new Playlist(sheet, []);
  }
};
