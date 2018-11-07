import * as React from 'react';
import { List } from 'semantic-ui-react';
import { PlayListItemComponent } from './PlaylistItemComponent1';
import { PlayListItem } from 'src/models';

interface Props {
  items: PlayListItem[];
}

export class PlayListComponent extends React.Component<Props> {
  public render() {
    const { items } = this.props;
    return (
      <List divided verticalAlign="middle">
        {items.map((item, idx) => {
          return (
            <PlayListItemComponent key={idx} item={item} />
          );
        })}
      </List>
    );
  }
}
