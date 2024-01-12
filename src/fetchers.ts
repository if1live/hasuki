import YouTube from "youtube-sr";

export const fetcher_playlist = async (...args: string[]) => {
  const [id, ...rest] = args;
  const url = `https://www.youtube.com/playlist?list=${id}`;

  // TODO: pagination 적용?
  const playlist = await YouTube.getPlaylist(url, { fetchAll: true });
  return playlist;
};

export const fetcher_video = async (...args: string[]) => {
  const [id, ...rest] = args;
  const url = `https://www.youtube.com/watch?v=${id}`;

  const video = await YouTube.getVideo(url);
  return video;
};

type FetchFn = (typeof globalThis)["fetch"];
type FetchOverrideFn = (fetch_base: FetchFn) => FetchFn;

/**
 * https://corsproxy.io/ 써서 cors 우회
 * 나중에 corsproxy.io 막히면 프록시만 교체하면 될듯
 */
const fetch_corsproxy: FetchOverrideFn = (fetch_base) => {
  return async (url, init) => {
    if (typeof url === "string") {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      return await fetch_base(proxyUrl, init);
    }

    // else...
    return await fetch_base(url, init);
  };
};

const fetch_mock: FetchOverrideFn = (fetch_base) => {
  return async (url, init) => {
    if (typeof url === "string") {
      // TODO: localhost fake
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      return await fetch_base(proxyUrl, init);
    }

    // else...
    return await fetch_base(url, init);
  };
};

const fetch_none: FetchOverrideFn = (fetch_base) => {
  return fetch_base;
};

export const fetch_proxy = (
  proxy: "corsproxy" | "mock" | "none",
): FetchOverrideFn => {
  console.log({ proxy });

  switch (proxy) {
    case "corsproxy":
      return fetch_corsproxy;
    case "mock":
      return fetch_mock;
    default:
      return fetch_none;
  }
};