function onEdit(e) {
  const range = e.range;
  handleEdit(range.getRow(), range.getColumn());
}

function test_func() {
  handleEdit(94, 1, 'https://youtube.com/watch?v=zRkA1xYBZBQ');
}

function handleEdit(row, col) {
  if(col !== 1) { return; }

  const sheet = SpreadsheetApp.getActiveSheet();
  const url = sheet.getRange(row, col).getValue();
  if(url) {
    const videoId = getVideoId(url);
    if(!videoId) { return; }

    const info = loadVideoInfo(videoId);
    if(!info) { return; }

    writeRecord(row, info);

  } else {
    clearRecord(row);
  }
}

var COL_TITLE = 2;
var COL_INFO = 5;
var COL_LAST_MODIFIED = 6;

function writeRecord(row, info) {
  const sheet = SpreadsheetApp.getActiveSheet();

  sheet.getRange(row, COL_TITLE).setValue(info['title']);
  sheet.getRange(row, COL_INFO).setValue(JSON.stringify(info));
  sheet.getRange(row, COL_LAST_MODIFIED).setValue(new Date());
}

function clearRecord(row) {
  const sheet = SpreadsheetApp.getActiveSheet();

  sheet.getRange(row, COL_TITLE).setValue('');
  sheet.getRange(row, COL_INFO).setValue('');
  sheet.getRange(row, COL_LAST_MODIFIED).setValue('');
}


function getVideoId(text) {
  const MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/
  const m = text.match(MATCH_URL);
  return m ? m[1] : undefined;
}


function loadVideoInfo(videoId) {
  const results = YouTube.Videos.list('id, snippet, contentDetails', {
    id: videoId,
  });
  if(results.items.length === 0) { return undefined; }
  const item = results.items[0];

  // https://developers.google.com/youtube/v3/docs/videos#resource
  return {
    title: item.snippet.title,
    duration: item.contentDetails.duration,
    thumbnails: item.snippet.thumbnails,
  };
}
