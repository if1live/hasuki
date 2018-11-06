import * as React from 'react';
import { secondsToDisplay } from 'src/helpers';
import { List, Button } from 'semantic-ui-react';
import { PlayListItem } from 'src/models';

interface Props {
  item: PlayListItem;
}

export class PlayListItemComponent extends React.Component<Props> {
  private get length() {
    const { seconds } = this.props.item;
    return seconds
      ? secondsToDisplay(seconds)
      : '?:??';
  }

  private onPlayClick = () => {
    console.log(`todo play audio`);
  }

  public render() {
    // 긴 문자열 대응하기

    const { title } = this.props.item;

    return (
      <List.Item>
        <List.Content floated="right">
          <Button.Group basic>
            <Button onClick={this.onPlayClick} icon="play" />
          </Button.Group>
        </List.Content>
        <List.Content>
          <List.Header>{title}</List.Header>
          <span>{this.length}</span>
        </List.Content>
      </List.Item >
    );
  }
}
