import React, { MutableRefObject } from "react";
import ReactPlayerPkg from "react-player";
import { PlayerProps } from "./YouTubeMusicPlayer.js";

const ReactPlayer = ReactPlayerPkg as unknown as typeof ReactPlayerPkg.default;

export const PlainPlayer = React.forwardRef<
  MutableRefObject<ReactPlayerPkg.default | null>,
  PlayerProps
>((props, ref) => {
  const { video } = props;

  return (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        ref={ref as any}
        playing={props.playing}
        url={video.url}
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
    </div>
  );
});
