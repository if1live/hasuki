import ReactPlayerPkg from "react-player";
import useSWR from "swr";
import { ErrorView } from "../components/ErrorView.js";
import { VideoLink } from "../components/index.js";
import { fetcher_video } from "../fetchers.js";

const ReactPlayer = ReactPlayerPkg as unknown as typeof ReactPlayerPkg.default;

export const ExamplePage = () => {
  return (
    <>
      <Example_NotWorkingInMobile />
      {/* <Example_FetchVideo videoId="Sc8RTc6vKPE" /> */}
      <Example_FetchVideo videoId="SHkF48SgiSA" />
    </>
  );
};

const Example_NotWorkingInMobile = () => {
  const videoId = "Sc8RTc6vKPE";
  return (
    <div>
      모바일에서 안나오는 영상
      <VideoLink videoId={videoId} />
      <ReactPlayer url={`https://www.youtube.com/watch?v=${videoId}`} />
    </div>
  );
};

const Example_FetchVideo = (props: {
  videoId: string;
}) => {
  const { videoId } = props;
  const { data, error, isLoading } = useSWR(videoId, fetcher_video);

  if (error) {
    return <ErrorView error={error} />;
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return (
    <>
      <h2>
        dump: <VideoLink videoId={videoId} />
      </h2>
      <pre>{JSON.stringify(data.adaptiveFormats, null, 2)}</pre>
      <pre>{JSON.stringify(data.formats, null, 2)}</pre>
    </>
  );
};
