import * as React from 'react';
import { PlaylistComponent } from './PlaylistComponent';
import { Playlist } from 'src/models';

interface Props {
  playlist: Playlist;
}
export class PlaylistView extends React.Component<Props> {
  public render() {
    const { playlist } = this.props;
    return (
      <PlaylistComponent playlist={playlist} />
    );
  }
}
