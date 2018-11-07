import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { getLinkType, LinkType, openTab } from 'src/helpers';
import { Playlist } from 'src/models';

interface Props {
  stop: () => void;
  playPause: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  random: () => void;
  playlist: Playlist;
  cursor?: number;
  playing: boolean;
  baseUrl?: string;
}

export class ControlButtonGroup extends React.Component<Props> {
  private openUrl = () => {
    if (this.isExternalUrl()) {
      const { baseUrl } = this.props;
      if (baseUrl !== undefined) { openTab(baseUrl); }
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
      cursor,
      playlist,
      baseUrl,
      playing,
      stop,
      playPause,
      previousTrack,
      nextTrack,
      random,
    } = this.props;

    const hasItems = playlist.length > 0;

    return (
      <Button.Group icon widths="6">
        <Button icon="stop"
          onClick={stop}
          disabled={cursor !== undefined} />
        <Button icon={playing ? 'pause' : 'play'}
          onClick={playPause}
          disabled={baseUrl === undefined} />
        <Button icon="step backward"
          onClick={previousTrack}
          disabled={!hasItems} />
        <Button icon="step forward"
          onClick={nextTrack}
          disabled={!hasItems} />
        <Button icon="random"
          onClick={random}
          disabled={!hasItems} />
        <Button icon="external" onClick={this.openUrl}
          disabled={!this.isExternalUrl()} />
      </Button.Group>
    );
  }
}
