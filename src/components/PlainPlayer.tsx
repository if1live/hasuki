import { useRef } from "react";
import ReactPlayerPkg from "react-player";
import { PlayerProps } from "./YouTubeMusicPlayer.js";

const ReactPlayer = ReactPlayerPkg as unknown as typeof ReactPlayerPkg.default;

export const PlainPlayer = (props: PlayerProps) => {
  const { video } = props;

  const ref = useRef<ReactPlayerPkg.default | null>(null);

  return (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        ref={ref}
        playing={props.playing}
        url={video.url}
        volume={props.volume}
        onEnded={props.onEnded}
        onReady={props.onReady}
        onProgress={props.onProgress}
        onSeek={props.onSeek}
        onError={props.onError}
        onDuration={props.onDuration}
        onPlay={() => props.setPlaying(true)}
        onPause={() => props.setPlaying(false)}
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
};
