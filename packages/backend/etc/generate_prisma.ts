import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

// prisma-kysely로 생성된 파일을 손대고 싶다.
// prisma-kysely 자체를 고치면 일이 커져서 땜질하는거

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const fp = path.join(dirname, "../src/tables/codegen.ts");

let content = await fs.readFile(fp, "utf-8");
content = content.replaceAll("    ", "  ");
content = content.replaceAll("hasuki", "");

const re = /\s+([A-Z])(\w+): (\w+);$/;
let lines = content.split("\n");
lines = lines.map((line) => {
  const m = re.exec(line);
  if (m) {
    return `  ${m[1]?.toLowerCase()}${m[2]}: ${m[3]};`;
  }
  return line;
});

const output = lines.join("\n");
await fs.writeFile(fp, output, "utf-8");
