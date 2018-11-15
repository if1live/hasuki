import {
  Playlist,
  parseDuration,
} from './Playlist';
import { PlaylistItem } from './PlaylistItem';
import * as faker from 'faker';

const makeItem = (url: string, order: number): PlaylistItem => ({
  url,
  order,
  group: faker.random.alphaNumeric(8),
});

describe('Playlist#cursorToIndex', () => {
  const playlist = new Playlist('simple', [
    makeItem('foo', 1),
    makeItem('bar', 2),
    makeItem('spam', 3),
  ]);
  const len = playlist.length;

  test('simple', () => {
    expect(playlist.cursorToIndex(0)).toEqual(0);
    expect(playlist.cursorToIndex(1)).toEqual(1);
    expect(playlist.cursorToIndex(2)).toEqual(2);
  });

  test('minus', () => {
    expect(playlist.cursorToIndex(-1)).toEqual(2);
    expect(playlist.cursorToIndex(-2)).toEqual(1);
    expect(playlist.cursorToIndex(-3)).toEqual(0);
  });

  test('minus - cycle', () => {
    for (let i = 0; i < 4; i++) {
      expect(playlist.cursorToIndex(-2 - len * i)).toEqual(1);
    }
  });

  test('overflow', () => {
    expect(playlist.cursorToIndex(3)).toEqual(0);
    expect(playlist.cursorToIndex(4)).toEqual(1);
    expect(playlist.cursorToIndex(5)).toEqual(2);
  });

  test('overflow - cycle', () => {
    for (let i = 0; i < 4; i++) {
      expect(playlist.cursorToIndex(4 + len * i)).toEqual(1);
    }
  });
});

describe('parseYouTubeDuration', () => {
  test('PT19S', () => expect(parseDuration('PT19S')).toEqual(19));
  test('PT3M52S', () => expect(parseDuration('PT3M52S')).toEqual(3 * 60 + 52));
  test('PT1H7M50S', () => expect(parseDuration('PT1H7M50S')).toEqual(1 * 3600 + 7 * 60 + 50));
  test('invalid', () => expect(parseDuration('invalid')).toBeUndefined());
});
