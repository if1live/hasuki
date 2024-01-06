import path from "node:path";
import url from "node:url";

export const NODE_ENV = process.env.NODE_ENV || "development";

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
export const rootPath = path.join(dirname, "..");
export const viewPath = path.join(rootPath, "views");
export const staticPath = path.join(rootPath, "static");
