import * as React from 'react';
import { PlaylistComponent } from './PlaylistComponent';
import { PlaylistItem } from 'src/models';

interface Props {
  items: PlaylistItem[];
}
export class PlaylistView extends React.Component<Props> {
  public render() {
    const { items } = this.props;
    return (
      <PlaylistComponent items={items} />
    );
  }
}
