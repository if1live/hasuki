import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import App from "./App.tsx";
import "./index.css";

/*
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
*/

const fetch_base = globalThis.fetch;
/**
 * https://corsproxy.io/ 써서 cors 우회
 * 나중에 corsproxy.io 막히면 프록시만 교체하면 될듯
 */
const fetch_next: typeof fetch_base = async (url, init) => {
  if (typeof url === "string") {
    const urlObj = new URL(url);
    if (urlObj.hostname === "www.youtube.com") {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      return await fetch_base(proxyUrl, init);
    }
  }
  // else
  return await fetch_base(url, init);
};
globalThis.fetch = fetch_next as typeof fetch_base;

// https://stackoverflow.com/a/71982736
// useEffect 2번 호출되는거 막는 StrictMode 끄는것보다 좋은 방법을 모르겠다.

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryParamProvider adapter={WindowHistoryAdapter}>
    <App />
  </QueryParamProvider>,
);
