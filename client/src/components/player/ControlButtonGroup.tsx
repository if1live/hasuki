import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { getLinkType, LinkType, openTab } from 'src/helpers';

interface Props {
  stop: () => void;
  playPause: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  random: () => void;
  playing: boolean;
  baseUrl?: string;
}

export class ControlButtonGroup extends React.Component<Props> {
  private openUrl = () => {
    if (this.isExternalUrl()) {
      const { baseUrl } = this.props;
      if (baseUrl) { openTab(baseUrl); }
    }
  }

  private isExternalUrl = () => {
    const { baseUrl } = this.props;
    if (baseUrl) {
      const linktype = getLinkType(baseUrl);
      if (linktype !== LinkType.None) {
        return true;
      }
    }
    return false;
  }

  public render() {
    const {
      playing,
      stop,
      playPause,
      previousTrack,
      nextTrack,
      random,
    } = this.props;

    return (
      <Button.Group icon widths="6">
        <Button icon="stop" onClick={stop} />
        <Button icon={playing ? 'pause' : 'play'} onClick={playPause}></Button>
        <Button icon="step backward" onClick={previousTrack} />
        <Button icon="step forward" onClick={nextTrack} />
        <Button icon="random" onClick={random} />
        <Button icon="external" onClick={this.openUrl}
          disabled={!this.isExternalUrl()} />
      </Button.Group>
    );
  }
}
