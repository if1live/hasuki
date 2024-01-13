import useSWRImmutable from "swr/immutable";
import { ErrorView } from "../components/ErrorView.js";
import { MyPlayer } from "../components/MyPlayer.js";
import { fetcher_video } from "../fetchers.js";
import { PlayerTag } from "../types.js";

interface Props {
  videoId: string;
}

export const SinglePage = (props: Props) => {
  const { videoId } = props;

  const { data, error, isLoading } = useSWRImmutable(videoId, fetcher_video);

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
