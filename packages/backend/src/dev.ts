import * as livereload from "livereload";
import { app } from "./app.js";
import * as settings from "./settings.js";

/*
const liveServer = livereload.createServer(
  {
    exts: ["html", "css", "liquid"],
  },
  () => console.log("livereload running..."),
);
liveServer.watch([settings.rootPath, settings.viewPath]);
*/

/*
const definitions: FunctionDefinition[] = [
  {
    name: "http",
    handler: http_main.dispatch,
    events: [
      { httpApi: { route: "ANY /" } },
      { httpApi: { route: "ANY /{pathname+}" } },
    ],
  },
];

const options = {
  httpApi: { port: 3000 },
};

const inst = standalone({
  ...options,
  functions: definitions,
});
await inst.start();
console.log("standalone", options);
*/

const port = 3000;
app.listen(port, () => console.log(`express running...: ${port}`));
