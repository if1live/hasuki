// https://tanaikech.github.io/2019/03/26/gastips/
function parseQuery(url) {
  const query = url.split("?")[1];
  if (query) {
    return query.split("&").reduce((o, e) => {
      const temp = e.split("=");
      const key = temp[0].trim();
      const value = temp[1].trim();
      o[key] = value;
      return o;
    }, {});
  }
  return null;
}

// from react-player source
const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;

/**
 * @param url {string}
 */
const parseYouTubeUrl = (url) => {
  const m = url.match(MATCH_URL_YOUTUBE);
  if (!m) {
    return undefined;
  }

  const params = parseQuery(url);

  const videoId = params.v ?? undefined;
  const playlistId = params.list ?? undefined;

  if (videoId || playlistId) {
    return {
      videoId,
      playlistId,
    };
  }

  // query string으로 뜯을수 없으면 공유용 단축 url
  return {
    videoId: m[1],
    playlistId: undefined,
  };
};

function test_parseYouTubeUrl() {
  {
    const url = "https://youtube.com/watch?v=zRkA1xYBZBQ";
    const actual = parseYouTubeUrl(url);
    // console.log(actual);
    // { videoId: 'zRkA1xYBZBQ', playlistId: undefined }
  }
  {
    const url =
      "https://www.youtube.com/playlist?list=PL-tS4i4IHFJj4EOQjXEglBX9DLOT4hfS4";
    const actual = parseYouTubeUrl(url);
    // 	{ videoId: undefined, playlistId: 'PL-tS4i4IHFJj4EOQjXEglBX9DLOT4hfS4' }
    // console.log(actual);
  }
}

/**
 * @param videoId {string}
 */
function loadVideoInfo(videoId) {
  const results = YouTube.Videos.list("id, snippet, contentDetails", {
    id: videoId,
  });
  if (results.items.length === 0) {
    return undefined;
  }
  const item = results.items[0];

  // https://developers.google.com/youtube/v3/docs/videos#resource
  return {
    id: videoId,
    title: item.snippet.title,
    duration: item.contentDetails.duration,
    thumbnails: item.snippet.thumbnails,
  };
}

/**
 * @param playlistId {string}
 */
function loadPlaylistInfo(playlistId) {
  const results = YouTube.Playlists.list("id,contentDetails,localizations,snippet,status", {
    id: playlistId,
  });
  if (results.items.length === 0) {
    return;
  }

  const item = results.items[0];

  // https://developers.google.com/youtube/v3/docs/playlists?hl=ko
  return {
    id: playlistId,
    title: item.snippet.title,
    thumbnails: item.snippet.thumbnails,
    itemCount: item.contentDetails.itemCount,
  };
}

function test_playlist() {
  const x = loadPlaylistInfo("PL-tS4i4IHFJj4EOQjXEglBX9DLOT4hfS4");
  console.log(x);
}

function onEdit(e) {
  const range = e.range;
  handleEdit(range.getRow(), range.getColumn());
}

function handleEdit(row, col) {
  if (col !== 1) {
    return;
  }

  const sheet = SpreadsheetApp.getActiveSheet();
  const url = sheet.getRange(row, col).getValue();
  if (url) {
    const parsed = parseYouTubeUrl(url);
    console.log(url, parsed);
    if (!parsed) { return; }

    if (parsed.videoId) {
      const info = loadVideoInfo(parsed.videoId);
      if (!info) { return; }

      writeRecord_video(row, info);
    }

    if (parsed.playlistId) {
      const info = loadPlaylistInfo(parsed.playlistId);
      if (!info) { return; }

      writeRecord_playlist(row, info);
    }

  } else {
    clearRecord(row);
  }
}

// 1: orgin url
const COL_CATEGORY = 2;
const COL_VIDEO_ID = 3;
const COL_PLAYLIST_ID = 4;
const COL_TITLE = 5;
const COL_HASUKI = 6;
// 7-9 reserved:
const COL_INFO = 10;
const COL_LAST_MODIFIED = 11;

function writeRecord_video(row, info) {
  const sheet = SpreadsheetApp.getActiveSheet();

  sheet.getRange(row, COL_CATEGORY).setValue("video");
  sheet.getRange(row, COL_VIDEO_ID).setValue(info.id);
  sheet.getRange(row, COL_PLAYLIST_ID).setValue("");

  const url = `https://hasuki.vercel.app/?v=${info.id}`;
  sheet.getRange(row, COL_HASUKI).setValue(url);

  sheet.getRange(row, COL_TITLE).setValue(info.title);

  sheet.getRange(row, COL_INFO).setValue(JSON.stringify(info));
  sheet.getRange(row, COL_LAST_MODIFIED).setValue(new Date());
}

function writeRecord_playlist(row, info) {
  const sheet = SpreadsheetApp.getActiveSheet();

  sheet.getRange(row, COL_CATEGORY).setValue("playlist");
  sheet.getRange(row, COL_VIDEO_ID).setValue("");
  sheet.getRange(row, COL_PLAYLIST_ID).setValue(info.id);

  const url = `https://hasuki.vercel.app/?list=${info.id}`;
  sheet.getRange(row, COL_HASUKI).setValue(url);

  sheet.getRange(row, COL_TITLE).setValue(info.title);

  sheet.getRange(row, COL_INFO).setValue(JSON.stringify(info));
  sheet.getRange(row, COL_LAST_MODIFIED).setValue(new Date());
}

function clearRecord(row) {
  const sheet = SpreadsheetApp.getActiveSheet();

  sheet.getRange(row, COL_CATEGORY).setValue("");
  sheet.getRange(row, COL_VIDEO_ID).setValue("");
  sheet.getRange(row, COL_PLAYLIST_ID).setValue("");

  sheet.getRange(row, COL_HASUKI).setValue("");

  sheet.getRange(row, COL_TITLE).setValue("");

  sheet.getRange(row, COL_INFO).setValue("");
  sheet.getRange(row, COL_LAST_MODIFIED).setValue("");
}
