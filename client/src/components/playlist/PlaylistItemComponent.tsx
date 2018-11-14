import * as React from 'react';
import {
  secondsToDisplay,
  getLinkType,
  LinkType,
} from 'src/helpers';
import { List, Icon } from 'semantic-ui-react';
import {
  PlaylistItem,
  PlaylistItemHolder,
} from 'src/models';
import { ExternalLink } from './ExternalLink';


interface Props {
  item: PlaylistItem;
  active: boolean;
  play: () => void;
}

const itemDetailStyle = {
  textAlign: 'right',
};

export class PlaylistItemComponent extends React.Component<Props> {
  private get length() {
    const { milliseconds } = this.props.item;
    return milliseconds
      ? secondsToDisplay(milliseconds / 1000)
      : '?:??';
  }

  public render() {
    // TODO 긴 문자열 대응하기
    const { active, play, item } = this.props;
    const { url } = this.props.item;
    const linktype = getLinkType(url);

    const SEPARATOR = ' · ';
    const holder = new PlaylistItemHolder(item);
    const group = item.group;

    return (
      <List.Item>
        <List.Content>
          <List.Header as="a" onClick={play}>
            {active ? <Icon name="play" /> : null}
            {holder.displayTitle}
            {group ? `${SEPARATOR} ${group}` : null}
          </List.Header>

          <List.Description style={itemDetailStyle}>
            <ExternalLink url={url} />
            {linktype !== LinkType.None ? SEPARATOR : null}
            {this.length}
          </List.Description>
        </List.Content>
      </List.Item >
    );
  }
}
