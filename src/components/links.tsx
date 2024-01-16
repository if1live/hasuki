import { CSSProperties } from "react";

interface MediaProps {
  id: string;
}

const commonSttyle: CSSProperties = {
  wordWrap: "break-word",
};

export const MediaLink = (props: {
  provider: "yt" | "sc";
  id: string;
}) => {
  const { provider } = props;
  switch (provider) {
    case "yt":
      return <MediaLink_YouTube {...props} />;
    case "sc":
      return <MedisLink_SoundCloud {...props} />;
  }
};

const MedisLink_SoundCloud = (props: MediaProps) => {
  const { id } = props;

  // https://soundcloud.com/moebyni/clannad-dango-daikazoku
  const url = `https://soundcloud.com/${id}`;
  return (
    <a href={url} target="_blank" rel="noreferrer" style={commonSttyle}>
      {id}
    </a>
  );
};

const MediaLink_YouTube = (props: MediaProps) => {
  const { id } = props;
  const url = `https://www.youtube.com/watch?v=${id}`;
  return (
    <a href={url} target="_blank" rel="noreferrer" style={commonSttyle}>
      {id}
    </a>
  );
};

export const PlaylistLink = (props: {
  playlistId: string;
}) => {
  const { playlistId } = props;
  const url = `https://www.youtube.com/playlist?list=${playlistId}`;
  return (
    <a href={url} target="_blank" rel="noreferrer" style={commonSttyle}>
      {playlistId}
    </a>
  );
};
