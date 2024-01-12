import ReactPlayer from "react-player";
import { VideoLink } from "../components";

export const ExamplePage = () => {
  const fn_notWorkingInMobile = () => {
    const videoId = "Sc8RTc6vKPE";
    return (
      <div>
        모바일에서 안나오는 영상
        <VideoLink videoId={videoId} />
        <ReactPlayer url={`https://www.youtube.com/watch?v=${videoId}`} />
      </div>
    );
  };
  return <>{fn_notWorkingInMobile()}</>;
};
