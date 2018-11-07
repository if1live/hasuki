import * as React from 'react';
import { secondsToDisplay, getLinkType, LinkType } from 'src/helpers';
import { List } from 'semantic-ui-react';
import { PlaylistItem, getTitle } from 'src/models';


interface Props {
  item: PlaylistItem;
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

  private onPlayClick = () => {
    console.log(`todo play audio`);
  }

  public render() {
    // TODO 긴 문자열 대응하기
    const { url } = this.props.item;
    const linktype = getLinkType(url);

    const SEPARATOR = ' · ';
    const displayTitle = getTitle(this.props.item);

    return (
      <List.Item>
        <List.Content>
          <List.Header as="a" onClick={this.onPlayClick}>{displayTitle}</List.Header>
          <List.Description style={itemDetailStyle}>
            <ExternalLink url={url} />
            {(() => linktype !== LinkType.None ? SEPARATOR : null)()}
            {this.length}
          </List.Description>
        </List.Content>
      </List.Item >
    );
  }
}

interface LinkProps {
  url: string;
}


class ExternalLink extends React.PureComponent<LinkProps> {
  private openUrl = () => {
    window.open(this.props.url, '_blank');
  }

  public render() {
    const ty = getLinkType(this.props.url);
    return (
      <span>
        {(() => ty === LinkType.YouTube ? <a onClick={this.openUrl}>YouTube</a> : null)()}
        {(() => ty === LinkType.SoundCloud ? <a onClick={this.openUrl}>SoundCloud</a> : null)()}
      </span>
    );
  }
}
