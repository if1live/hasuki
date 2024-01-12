import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import App from "./App.tsx";
import { fetch_proxy } from "./fetchers.ts";
import "./index.css";

// https://stackoverflow.com/a/71982736
// useEffect 2번 호출되는거 막는 StrictMode 끄는것보다 좋은 방법을 모르겠다.
/*
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
*/

const proxy = "corsproxy";
const fetch_factory = fetch_proxy(proxy);
const fetch_base = globalThis.fetch;
const fetch_next = fetch_factory(fetch_base);
globalThis.fetch = fetch_next;

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryParamProvider adapter={WindowHistoryAdapter}>
    <App />
  </QueryParamProvider>,
);
