import { Button, ButtonGroup, Icon } from "semantic-ui-react";

interface Props {
  onPreviousTrack: () => void;
  onNextTrack: () => void;
  onPlayPauseToggle: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onShuffle: () => void;
  playing: boolean;
  currentTrack: number;
  trackCount: number;
}

export const PlayerButtonGroup = (props: Props) => {
  const { playing } = props;

  const isFirst = props.currentTrack === 0;
  const isLast = props.currentTrack === props.trackCount - 1;

  return (
    <ButtonGroup size="huge">
      <Button icon onClick={props.onPreviousTrack} disabled={isFirst}>
        <Icon name="step backward" />
      </Button>

      <Button icon onClick={props.onSeekBackward}>
        <Icon name="backward" />
      </Button>

      <Button icon positive onClick={props.onPlayPauseToggle}>
        {playing ? <Icon name="pause" /> : <Icon name="play" />}
      </Button>

      <Button icon onClick={props.onSeekForward}>
        <Icon name="forward" />
      </Button>

      <Button icon onClick={props.onNextTrack} disabled={isLast}>
        <Icon name="step forward" />
      </Button>

      <Button icon onClick={props.onShuffle}>
        <Icon name="shuffle" />
      </Button>
    </ButtonGroup>
  );
};
