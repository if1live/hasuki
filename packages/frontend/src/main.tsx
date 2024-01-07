import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import App from "./App.tsx";
import "./index.css";

/*
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
*/

// https://stackoverflow.com/a/71982736
// useEffect 2번 호출되는거 막는 더 좋은 방법을 모르겠다.
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
