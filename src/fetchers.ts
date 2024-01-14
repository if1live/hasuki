import * as YouTube from "youtube-sr";
import { VideoModel } from "../api/video.js";
import { Playlist } from "./types.js";

// fetcher 내부 구현까지 다를 필요는 없을듯
// 그래도 리턴 타입을 명시하려고 나눴다
export const fetcher_generic = async <T>(...args: string[]): Promise<T> => {
  const [url, ...rest] = args;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error("fetcher failed", {
      cause: {
        url,
        status: res.status,
        data,
      },
    });
  }
  return data;
};

export const fetcher_playlist = async (
  ...args: string[]
): Promise<{ playlist: Playlist }> => {
  return await fetcher_generic(...args);
};

export const fetcher_video = async (
  ...args: string[]
): Promise<{
  playlist: Playlist;
  adaptiveFormats: YouTube.VideoStreamingFormatAdaptive[];
  formats: YouTube.VideoStreamingFormat[];
}> => {
  return await fetcher_generic(...args);
};

export const fetcher_ytdl = async (...args: string[]): Promise<VideoModel> => {
  return await fetcher_generic(...args);
};

type FetchFn = (typeof globalThis)["fetch"];
type FetchOverrideFn = (fetch_base: FetchFn) => FetchFn;

/**
 * https://corsproxy.io/ 써서 cors 우회
 * 나중에 corsproxy.io 막히면 프록시만 교체하면 될듯
 */
const fetch_corsproxy: FetchOverrideFn = (fetch_base) => {
  // corsproxy는 user-agent 헤더가 없으면 cors 우회를 안해준다
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  return async (url, init) => {
    if (typeof url === "string") {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

      const headers: HeadersInit = {
        ...init?.headers,
        "user-agent": userAgent,
      };

      return await fetch_base(proxyUrl, {
        ...init,
        headers,
      });
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
