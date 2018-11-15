import * as React from 'react';
import { PlayerState } from 'src/App';
import { ControlButtonGroup } from '../components/player';
import { Progress, Segment, Image } from 'semantic-ui-react';
import Duration from 'src/Duration';
import { PlaylistItemHolder, Playlist } from 'src/models';

interface Props {
  playlist: Playlist;
  stop: () => void;
  playPause: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  updatePlaylistCursor: (cursor: number) => void;
}

export class PlayerContainer extends React.Component<Props & PlayerState> {
  private random = () => {
    const { playlist, updatePlaylistCursor } = this.props;
    const len = playlist.length;
    const cursor = Math.floor(Math.random() * (len + 1));
    updatePlaylistCursor(cursor);
  }

  private getItem = () => {
    const {
      cursor,
      playlist,
    } = this.props;
    return cursor === undefined ? undefined : playlist.get(cursor);
  }

  public render() {
    const {
      playing,
      played,
      loaded,
      duration,
    } = this.props;

    const percentPlayed = played * 100;
    const percentLoaded = loaded * 100;

    const colorPlayed = playing ? 'green' : 'yellow';
    const colorLoaded = loaded === 1 ? 'blue' : 'orange';

    const item = this.getItem();
    let title = 'NO AUDIO';
    if (item) {
      const holder = new PlaylistItemHolder(item);
      title = holder.displayTitle;
    }

    const thumbnail = item ? item.thumbnail : undefined;

    return (
      <div>
        <Segment>
          <Progress
            percent={percentPlayed}
            color={colorPlayed}
            attached="top" />

          {thumbnail ? <Image src={thumbnail} floated="right" /> : null}

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
