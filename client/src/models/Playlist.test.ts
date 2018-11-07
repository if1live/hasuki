import { Playlist } from './Playlist';
import { PlaylistItem } from './PlaylistItem';

const makeItem = (url: string): PlaylistItem => ({
  url,
});

describe('Playlist#cursorToIndex', () => {
  const playlist = new Playlist('simple', [
    makeItem('foo'),
    makeItem('bar'),
    makeItem('spam'),
  ]);

  test('simple', () => {
    expect(playlist.cursorToIndex(0)).toEqual(0);
    expect(playlist.cursorToIndex(1)).toEqual(1);
    expect(playlist.cursorToIndex(2)).toEqual(2);
  });

  test('minus', () => {
    expect(playlist.cursorToIndex(-1)).toEqual(2);
    expect(playlist.cursorToIndex(-2)).toEqual(1);
    expect(playlist.cursorToIndex(-3)).toEqual(0);
    expect(playlist.cursorToIndex(-4)).toEqual(2);
  });

  test('overflow', () => {
    expect(playlist.cursorToIndex(3)).toEqual(0);
    expect(playlist.cursorToIndex(4)).toEqual(1);
    expect(playlist.cursorToIndex(5)).toEqual(2);
    expect(playlist.cursorToIndex(6)).toEqual(0);
  });
});
