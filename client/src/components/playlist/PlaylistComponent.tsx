import * as React from 'react';
import { List } from 'semantic-ui-react';
import { PlaylistItemComponent } from './PlaylistItemComponent';
import { Playlist } from 'src/models';

interface Props {
  playlist: Playlist;
}

export class PlaylistComponent extends React.Component<Props> {
  public render() {
    const { playlist } = this.props;
    const { items } = playlist;

    return (
      <List divided verticalAlign="middle">
        {items.map((item, idx) => {
          return (
            <PlaylistItemComponent key={idx} item={item} />
          );
        })}
      </List>
    );
  }
}
