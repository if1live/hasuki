import { PlaylistItem } from './PlaylistItem';
import { SHEET_ID } from 'src/settings';

export const DEFAULT_PLAYLIST_NAME = 'default';

export class Playlist {
  public readonly name: string;
  public readonly items: PlaylistItem[];

  constructor(name: string, items: PlaylistItem[]) {
    this.name = name;
    this.items = [...items];
  }

  private cursorToIndex(cursor: number) {
    if (this.items.length === 0) {
      return undefined;
    }

    // js는 음수 % 를 하면 음수가 나온다
    const idx = cursor % this.items.length;
    return (idx < 0) ? idx + this.items.length : idx;
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

const isHidden = (row: Array<string | undefined>) => {
  const hidden = row[3] as (string | undefined);
  return (hidden && hidden.length > 0);
};

const makePlaylistItem = (row: Array<string | undefined>): PlaylistItem => {
  const url = row[0] as (string);
  const title = row[1] as (string | undefined);
  const duration = row[2] as (string | undefined);

  let milliseconds: (number | undefined);
  if (duration) {
    milliseconds = parseInt(duration, 10);
  }

  return {
    url, title, milliseconds,
  };
};

const fetchSheet = (sheet: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const gapi = window.gapi;
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheet}!A2:D`,
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
    const items = values
      .filter((x) => !isHidden(x))
      .map(makePlaylistItem);
    const playlist = new Playlist(sheet, items);
    return playlist;

  } catch (err) {
    console.error(err);
    return new Playlist(sheet, []);
  }
};
