import useSWR from "swr";
import { MyPlayer } from "../components/MyPlayer.js";
import { fetcher_video } from "../fetchers.js";

interface Props {
  videoId: string;
}

export const SinglePage = (props: Props) => {
  const { videoId } = props;

  const { data, error, isLoading } = useSWR(videoId, fetcher_video);

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

  const { playlist } = data;
  return <MyPlayer playlist={playlist} />;
};
