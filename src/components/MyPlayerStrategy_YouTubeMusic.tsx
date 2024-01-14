import React from "react";
import ReactPlayerPkg from "react-player";
import * as R from "remeda";
import useSWR from "swr";
import { fetcher_ytdl } from "../fetchers.js";
import { Video } from "../types.js";
import { ErrorView } from "./ErrorView.js";

const ReactPlayer = ReactPlayerPkg as unknown as typeof ReactPlayerPkg.default;

export type PlayerProps = {
  video: Video;

  playing: boolean;
  setPlaying: (playing: boolean) => void;

  volume: number;
} & Pick<
  ReactPlayerPkg.ReactPlayerProps,
  "onEnded" | "onReady" | "onProgress" | "onSeek" | "onError" | "onDuration"
>;

export const MyPlayerStrategy_YouTubeMusic = React.forwardRef<
  ReactPlayerPkg.default,
  PlayerProps
>((props, ref) => {
  const { video } = props;

  const url = `/api/video?id=${video.id}`;
  const { data, error, isLoading } = useSWR(url, fetcher_ytdl, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (error) {
    return <ErrorView error={error} />;
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  // audio
  const format = R.pipe(
    data.formats,
    R.filter((x) => x.hasAudio && !x.hasVideo),
    R.filter((x) => x.audioQuality === "AUDIO_QUALITY_MEDIUM"),
    R.sortBy((x) => x.audioBitrate ?? Infinity),
    R.first(),
  );
  if (format === undefined) {
    throw new Error("no audio format found");
  }

  return (
    <ReactPlayer
      ref={ref}
      playing={props.playing}
      url={format.url}
      volume={props.volume}
      onEnded={props.onEnded}
      onReady={props.onReady}
      onProgress={props.onProgress}
      onSeek={props.onSeek}
      onError={props.onError}
      onDuration={props.onDuration}
      config={{
        file: {
          forceAudio: true,
        },
      }}
      width="100%"
      height="100%"
    />
  );
});
