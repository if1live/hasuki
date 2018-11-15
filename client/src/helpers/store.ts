import Dexie from 'dexie';
import { Playlist, DEFAULT_PLAYLIST_NAME } from 'src/models/Playlist';
import { PlaylistItem } from 'src/models';

class PlaylistDatabase extends Dexie {
  public items: Dexie.Table<PlaylistItem, number>;

  constructor() {
    super('playlist');
    this.version(1).stores({
      items: '++id, url, title, milliseconds, group, thumbnail',
    });
  }
}

const db = new PlaylistDatabase();

export const synchronize = async (playlist: Playlist) => {
  await db.items.clear();
  await db.items.bulkAdd(playlist.items);
};

export const load = async () => {
  const items = await db.items.where('id').above(0).toArray();
  return new Playlist(DEFAULT_PLAYLIST_NAME, items);
};

export const clear = async () => {
  await db.delete();
  location.reload();
};


export const makeBlank = () => {
  const playlist = new Playlist(DEFAULT_PLAYLIST_NAME, []);
  return playlist;
};

