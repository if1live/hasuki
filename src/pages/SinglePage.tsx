import useSWRImmutable from "swr/immutable";
import { ErrorView } from "../components/ErrorView.js";
import { MyPlayer } from "../components/MyPlayer.js";
import { fetcher_video } from "../fetchers.js";
import { RedirectFn } from "../routes.js";

interface Props {
  videoId: string;
  autoplay: boolean;
  redirect: RedirectFn;
}

const toUrl = (props: Pick<Props, "videoId">) => {
  const { videoId } = props;
  const search = new URLSearchParams();
  search.append("action", "video");
  search.append("v", videoId);
  return `/api/simple?${search}`;
};

export const SinglePage = (props: Props) => {
  const url = toUrl(props);
  const { data, error, isLoading } = useSWRImmutable(url, fetcher_video);

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
