import * as React from 'react';
import Duration from 'src/Duration';

interface Props {
  url?: string;
  playing: boolean;
  volume: number;
  played: number;
  loaded: number;
  duration: number;
}

export class PlayerStatusViewer extends React.Component<Props> {
  public render() {
    const {
      url,
      playing,
      volume,
      played,
      loaded,
      duration,
    } = this.props;

    return (
      <dl>
        <dt>url</dt>
        <dd>{url || 'null'}</dd>

        <dt>playing</dt>
        <dd>{playing ? 'true' : 'false'}</dd>

        <dt>volume</dt>
        <dd>{volume.toFixed(3)}</dd>

        <dt>played</dt>
        <dd>{played.toFixed(3)}</dd>

        <dt>loaded</dt>
        <dd>{loaded.toFixed(3)}</dd>

        <dt>duration</dt>
        <dd><Duration seconds={duration} /></dd>

        <dt>elapsed</dt>
        <dd><Duration seconds={duration * played} /></dd>

        <dt>remaining</dt>
        <dd><Duration seconds={duration * (1 - played)} /></dd>
      </dl>
    );
  }
}
