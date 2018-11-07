import { API_SERVER } from 'src/settings';
import { videoFormat } from 'ytdl-core';

export const fetchYouTubeFormats = async (videoId: string) => {
  // 높은 bitrate 순서로 정렬되어있음
  try {
    // TODO 권한 붙이기
    const url = `${API_SERVER}/youtube/audio-url?video_id=${videoId}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const formats = data as videoFormat[];
    return formats;

  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getAudioUrl = (format: videoFormat) => {
  return format.url;
};

export const getLowFormat = (formats: videoFormat[]) => {
  if (formats.length === 0) { return undefined; }
  return formats[formats.length - 1];
};

export const getHighFormat = (formats: videoFormat[]) => {
  if (formats.length === 0) { return undefined; }
  return formats[0];
};
