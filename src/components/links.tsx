export const VideoLink = (props: {
  videoId: string;
}) => {
  const { videoId } = props;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {videoId}
    </a>
  );
};

export const PlaylistLink = (props: {
  playlistId: string;
}) => {
  const { playlistId } = props;
  const url = `https://www.youtube.com/playlist?list=${playlistId}`;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {playlistId}
    </a>
  );
};
