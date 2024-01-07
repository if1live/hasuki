import path from "node:path";
import url from "node:url";

export const NODE_ENV = process.env.NODE_ENV || "development";

const databaseUrl_localhost =
  "mysql://root:my-secret-pw@127.0.0.1:3306/localhost_dev";
export const DATABASE_URL = process.env.DATABASE_URL || databaseUrl_localhost;

const redisUrl_localhost = "redis://127.0.0.1:6379";
export const REDIS_URL = process.env.REDIS_URL || redisUrl_localhost;

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
export const rootPath = path.join(dirname, "..");
export const viewPath = path.join(rootPath, "views");
export const staticPath = path.join(rootPath, "static");
