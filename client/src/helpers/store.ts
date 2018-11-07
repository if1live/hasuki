import Dexie from 'dexie';
import { Playlist, DEFAULT_PLAYLIST_NAME } from 'src/models/Playlist';
import { delay } from './timeout';

const db = new Dexie('hasuki');
db.version(1).stores({
  playlist: '++id, url, title, milliseconds',
});

export const synchronize = (playlist: Playlist) => {
  return 1;
};

export const load = async () => {
  const playlist = makeBlank();
  await delay(100);
  return await playlist;
};

export const makeBlank = () => {
  const playlist = new Playlist(DEFAULT_PLAYLIST_NAME, []);
  return playlist;
};
