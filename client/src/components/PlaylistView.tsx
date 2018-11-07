import * as React from 'react';
import { PlayListComponent } from './PlayListComponent';
import { PlayListItem } from 'src/models';

interface Props {
  items: PlayListItem[];
}
export class PlayListView extends React.Component<Props> {
  public render() {
    const { items } = this.props;
    return (
      <PlayListComponent items={items} />
    );
  }
}
