import * as React from 'react';
import { PlayListComponent } from './PlayListComponent';
import { sampleUrls } from 'src/App';
import { PlayListItem } from 'src/models';

export class PlayListView extends React.Component {
  public render() {
    return (
      <PlayListComponent items={
        sampleUrls.map((u, idx): PlayListItem => ({
          url: u,
          title: `title-${idx}`,
          milliseconds: 123000,
        }))
      } />
    );
  }
}
