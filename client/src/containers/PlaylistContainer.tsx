import * as React from 'react';
import { PlaylistComponent } from '../components/playlist';
import { Playlist } from 'src/models';

interface Props {
  playlist: Playlist;
}
export class PlaylistContainer extends React.Component<Props> {
  public render() {
    const { playlist } = this.props;
    return (
      <PlaylistComponent playlist={playlist} />
    );
  }
}
