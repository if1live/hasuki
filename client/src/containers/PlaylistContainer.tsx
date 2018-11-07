import * as React from 'react';
import { PlaylistComponent } from '../components/playlist';
import { Playlist } from 'src/models';

interface Props {
  playlist: Playlist;
  cursor?: number;
  updatePlaylistCursor: (cursor: number) => void;
}
export class PlaylistContainer extends React.Component<Props> {
  public render() {
    return (
      <PlaylistComponent {...this.props} />
    );
  }
}
