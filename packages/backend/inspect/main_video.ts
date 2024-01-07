import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import ytdl from "ytdl-core";

/*
ytdl에서 사용할수 있는 api는 getInfo, getBasicInfo
둘중에 어떤걸 써야할지, 트래픽은 얼마나 나올지 예상해보기 위한 스크립트

P1cyCAUTWVg
getBasicInfo: 447800
getInfo: 440795

getBasicInfo 쓴다고 유의미하게 줄어들지 않음.
그냥 getInfo 쓰면될듯.
api 한번 호출할때마다 500kb 가까이 나오니까 inbound 트래픽 비용 확인할것
*/

const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const videoId = "P1cyCAUTWVg";

async function load(videoId: string, label: "getInfo" | "getBasicInfo") {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const info = await ytdl[label](url);
  const fp_content = path.resolve(dirname, `video_${label}.json`);

  const text = JSON.stringify(info, null, 2);
  await fs.writeFile(fp_content, text);

  console.log(`${label}: ${JSON.stringify(info).length}`);
}

await load(videoId, "getBasicInfo");
await load(videoId, "getInfo");
