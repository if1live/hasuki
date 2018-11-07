import * as React from 'react';
import { List } from 'semantic-ui-react';
import { PlaylistItemComponent } from './PlaylistItemComponent1';
import { PlaylistItem } from 'src/models';

interface Props {
  items: PlaylistItem[];
}

export class PlaylistComponent extends React.Component<Props> {
  public render() {
    const { items } = this.props;
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
