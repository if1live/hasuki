import * as React from 'react';
import { List } from 'semantic-ui-react';
import { PlaylistItemComponent } from './PlaylistItemComponent';
import { Playlist } from 'src/models';

interface Props {
  playlist: Playlist;
  cursor?: number;
  updatePlaylistCursor: (cursor: number) => void;
}

export class PlaylistComponent extends React.Component<Props> {
  public render() {
    const { playlist, cursor } = this.props;
    const { items } = playlist;

    return (
      <List divided verticalAlign="middle">
        {items.map((item, idx) => {
          const active = cursor !== undefined
            ? playlist.cursorToIndex(cursor) === idx
            : false;
          const play = () => {
            const { updatePlaylistCursor } = this.props;
            updatePlaylistCursor(idx);
          };
          return (
            <PlaylistItemComponent
              key={idx}
              item={item}
              active={active}
              play={play}
            />
          );
        })}
      </List>
    );
  }
}
