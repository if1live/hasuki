import useSWRImmutable from "swr/immutable";
import { ErrorView } from "../components/ErrorView.js";
import { MyPlayer } from "../components/MyPlayer.js";
import { fetcher_playlist } from "../fetchers.js";
import { RedirectFn } from "../routes.js";

interface Props {
  playlistId: string;
  videoId: string | null | undefined;

  autoplay: boolean;
  redirect: RedirectFn;
}

const toUrl = (props: Pick<Props, "playlistId" | "videoId">) => {
  const { playlistId, videoId } = props;
  const search = new URLSearchParams();
  search.append("action", "playlist");
  search.append("list", playlistId);
  if (videoId) {
    search.append("v", videoId);
  }
  return `/api/simple?${search}`;
};

export const PlaylistPage = (props: Props) => {
  const url = toUrl(props);
  const { data, error, isLoading } = useSWRImmutable(url, fetcher_playlist);

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
  return <MyPlayer playlist={playlist} {...props} />;
};
