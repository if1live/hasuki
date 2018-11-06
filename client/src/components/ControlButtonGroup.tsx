import * as React from 'react';
import { Button } from 'semantic-ui-react';

interface Props {
  stop: () => void;
  playPause: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  shuffle: () => void;
  sync: () => void;
  playing: boolean;
}

export class ControlButtonGroup extends React.Component<Props> {
  public render() {
    const {
      playing,
      stop,
      playPause,
      previousTrack,
      nextTrack,
      shuffle,
      sync,
    } = this.props;

    return (
      <Button.Group icon widths="6">
        <Button icon="stop" onClick={stop} />
        <Button icon={playing ? 'pause' : 'play'} onClick={playPause}></Button>
        <Button icon="step backward" onClick={previousTrack} />
        <Button icon="step forward" onClick={nextTrack} />
        <Button icon="shuffle" onClick={shuffle} />
        <Button icon="sync" onClick={sync} />
      </Button.Group>
    );
  }
}
