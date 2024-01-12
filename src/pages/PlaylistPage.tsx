import useSWR from "swr";
import { MyPlayer } from "../components/MyPlayer";
import { fetcher_playlist } from "../fetchers";
import { parse_playlist } from "../types";

interface Props {
  playlistId: string;
}

export const PlaylistPage = (props: Props) => {
  const { playlistId } = props;

  const { data, error, isLoading } = useSWR(playlistId, fetcher_playlist);

  if (error) {
    const err = error as Error;
    return (
      <>
        <h2>
          {err.name}: {err.message}
        </h2>
        <pre>{err.stack}</pre>
      </>
    );
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  const parsed = parse_playlist(data);
  return <MyPlayer playlist={parsed} />;
};
