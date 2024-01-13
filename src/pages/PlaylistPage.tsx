import useSWRImmutable from "swr/immutable";
import { ErrorView } from "../components/ErrorView.js";
import { MyPlayer } from "../components/MyPlayer.js";
import { fetcher_playlist } from "../fetchers.js";

interface Props {
  playlistId: string;
}

export const PlaylistPage = (props: Props) => {
  const { playlistId } = props;

  const { data, error, isLoading } = useSWRImmutable(
    playlistId,
    fetcher_playlist,
  );

  if (error) {
    return <ErrorView error={error} />;
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  const { playlist } = data;
  return <MyPlayer playlist={playlist} />;
};
