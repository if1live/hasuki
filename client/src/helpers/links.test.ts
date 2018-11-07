import { getYouTubeVideoId } from './links';

describe('getYouTubeVideoId', () => {
  test('youtube', () => {
    const url = 'https://www.youtube.com/watch?v=WIqrKvfEJos';
    expect(getYouTubeVideoId(url)).toEqual('WIqrKvfEJos');
  });

  test('not youtube', () => {
    const url = 'https://www.youtube.com/watch?v=WIqrKvfEJo';
    expect(getYouTubeVideoId(url)).toBeUndefined();
  });
});
