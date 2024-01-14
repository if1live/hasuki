import { Button, ButtonGroup, Icon } from "semantic-ui-react";
import { PlayerTag } from "../types.js";
import { Duration } from "./Duration.js";

interface Props {
  onPreviousTrack: () => void;
  onNextTrack: () => void;
  onPlayPauseToggle: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onShuffle: () => void;
  currentTrack: number;
  trackCount: number;

  title: string;
  playing: boolean;
  played: number;
  duration: number;
  onSeekChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeekStart: (target: HTMLInputElement) => void;
  onSeekEnd: (target: HTMLInputElement) => void;

  playerMode: PlayerTag;
  onNextPlayerMode: () => void;
}

export const MyPlayerController = (props: Props) => {
  const { playing, played, duration, onSeekStart, onSeekEnd } = props;

  const isFirst = props.currentTrack === 0;
  const isLast = props.currentTrack === props.trackCount - 1;

  type MouseEventFn = (e: React.MouseEvent<HTMLInputElement>) => void;
  type TouchEventFn = (e: React.TouchEvent<HTMLInputElement>) => void;

  const onMouseDown: MouseEventFn = (e) => onSeekStart(e.currentTarget);
  const onMouseUp: MouseEventFn = (e) => onSeekEnd(e.currentTarget);
  const onTouchStart: TouchEventFn = (e) => onSeekStart(e.currentTarget);
  const onTouchEnd: TouchEventFn = (e) => onSeekEnd(e.currentTarget);

  return (
    <div
      style={{
        // https://stackoverflow.com/a/2006008
        position: "fixed",
        bottom: "0",
        left: "50%",
        transform: "translate(-50%, 0%)",
        width: "100%",
        backgroundColor: "#f7f7f7",
        padding: "0.5em",
        textAlign: "center",
      }}
    >
      <div>
        <span>{props.title}</span>
        <br />
        <span>
          <Duration seconds={duration * played} /> |{" "}
          <Duration seconds={duration * (1 - played)} /> |{" "}
          <Duration seconds={duration} />
        </span>

        <div>
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onChange={props.onSeekChange}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <ButtonGroup icon>
        <Button onClick={props.onPreviousTrack} disabled={isFirst}>
          <Icon name="step backward" />
        </Button>

        <Button onClick={props.onSeekBackward}>
          <Icon name="backward" />
        </Button>

        <Button positive onClick={props.onPlayPauseToggle}>
          {playing ? <Icon name="pause" /> : <Icon name="play" />}
        </Button>

        <Button onClick={props.onSeekForward}>
          <Icon name="forward" />
        </Button>

        <Button onClick={props.onNextTrack} disabled={isLast}>
          <Icon name="step forward" />
        </Button>

        <Button onClick={props.onShuffle}>
          <Icon name="shuffle" />
        </Button>
      </ButtonGroup>

      <ButtonGroup floated="right">
        <Button icon onClick={props.onNextPlayerMode}>
          {props.playerMode}
        </Button>
      </ButtonGroup>
    </div>
  );
};
