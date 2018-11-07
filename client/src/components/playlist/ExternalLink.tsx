import { openTab, getLinkType, LinkType } from 'src/helpers';
import * as React from 'react';

const makeNameTable = () => {
  const m = new Map<LinkType, string>();
  m.set(LinkType.YouTube, 'YouTube');
  m.set(LinkType.SoundCloud, 'SoundCloud');
  return m;
};

const nameTable = makeNameTable();

interface Props {
  url: string;
}

export class ExternalLink extends React.PureComponent<Props> {
  private openUrl = () => {
    const { url } = this.props;
    if (url) { openTab(url); }
  }

  private get name() {
    const ty = getLinkType(this.props.url);
    const found = nameTable.get(ty);
    return found ? found : 'unknown';
  }

  public render() {
    return (
      <span>
        <a onClick={this.openUrl}>{this.name}</a>
      </span>
    );
  }
}
