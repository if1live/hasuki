import * as React from 'react';
import { PlayerState } from 'src/App';
import { ControlButtonGroup } from './ControlButtonGroup';
import { Progress, Segment } from 'semantic-ui-react';
import Duration from 'src/Duration';
import { PlaylistItemHolder } from 'src/models';

interface Props {
  stop: () => void;
  playPause: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
}

export class PlayerView extends React.Component<Props & PlayerState> {
  private random = () => {
    console.log('TODO random');
  }

  public render() {
    const {
      playing,
      played,
      loaded,
      duration,
      cursor,
      playlist,
    } = this.props;

    const percentPlayed = played * 100;
    const percentLoaded = loaded * 100;

    const colorPlayed = playing ? 'green' : 'yellow';
    const colorLoaded = loaded === 1 ? 'blue' : 'orange';

    const item = playlist.get(cursor);
    let title = 'NULL';
    if (item) {
      const holder = new PlaylistItemHolder(item);
      title = holder.displayTitle;
    }

    return (
      <div>
        <Segment>
          <Progress
            percent={percentPlayed}
            color={colorPlayed}
            attached="top" />
          {title}<br />
          duration=<Duration seconds={duration} /><br />
          elapsed=<Duration seconds={duration * played} /><br />
          remaining=<Duration seconds={duration * (1 - played)} />
          <Progress
            percent={percentLoaded}
            color={colorLoaded}
            attached="bottom" />
        </Segment>

        <ControlButtonGroup
          {...this.props}
          random={this.random}
        />
      </div>
    );
  }
}
