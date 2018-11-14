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
  return new Playlist(playlist.name, items);
};

class Row {
  private readonly arr: Array<string | undefined>;
  constructor(arr: Array<string | undefined>) {
    this.arr = arr;
  }

  public get url() { return this.arr[0] as string; }
  public get title() { return this.arr[1]; }
  public get duration() { return this.arr[2]; }
  public get group() { return this.arr[3]; }
  public get hidden() { return this.arr[4]; }
}

const isHidden = (row: Row) => {
  const hidden = row.hidden;
  return (hidden && hidden.length > 0);
};

const makePlaylistItem = (row: Row): PlaylistItem => {
  const duration = row.duration;
  let milliseconds: (number | undefined);
  if (duration) {
    milliseconds = parseInt(duration, 10);
  }

  return {
    url: row.url,
    title: row.title,
    milliseconds,
  };
};

const fetchSheet = (sheet: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const gapi = window.gapi;
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheet}!A2:E`,
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
