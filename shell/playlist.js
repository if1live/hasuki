const ytlist = require('youtube-playlist');

const url = 'https://www.youtube.com/playlist?list=PLP5eK7mHrTaF-INSHCxy6GzBiSWRslq1g';


ytlist(url, 'url').then(res => {
  /* Object
  { data:
    { playlist:
      [ 'https://youtube.com/watch?v=bgU7FeiWKzc',
        'https://youtube.com/watch?v=3PUVr8jFMGg',
        'https://youtube.com/watch?v=3pXVHRT-amw',
        'https://youtube.com/watch?v=KOVc5o5kURE' ] } }
    */
  const playlist = res.data.playlist;
  for (const url of playlist) {
    console.log(url);
  }
});
