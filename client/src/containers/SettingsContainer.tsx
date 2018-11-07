import * as React from 'react';
import { SheetProviderProps, AuthorizedState } from 'src/SheetProvider';
import { Button, Divider, Icon } from 'semantic-ui-react';
import { Playlist, fetchPlaylist, DEFAULT_PLAYLIST_NAME } from 'src/models';



interface Props {
  updatePlaylist: (playlist: Playlist) => void;
}

interface State {
  syncing: boolean;
}

export class SettingsContainer extends React.Component<Props & SheetProviderProps, State> {
  public state = {
    syncing: false,
  };

  private resetDB = () => {
    console.log('TODO reset db');
  }

  private syncPlaylist = async () => {
    this.setState({ syncing: true });

    const { updatePlaylist } = this.props;
    const playlist = await fetchPlaylist(DEFAULT_PLAYLIST_NAME);
    updatePlaylist(playlist);

    this.setState({ syncing: false });
  }

  private shufflePlaylist = () => {
    // TODO get playlist
    console.log('TODO shuffle db');
  }

  public render() {
    const {
      authState,
      authClicked,
      signoutClicked,
    } = this.props;
    const { syncing } = this.state;

    return (
      <div>
        <h2>google sheet</h2>
        <div >
          <Button onClick={authClicked}
            disabled={authState !== AuthorizedState.NotAuthorized}>
            authorize
          </Button>

          <Button onClick={signoutClicked}
            disabled={authState !== AuthorizedState.Authorized}>
            signout
          </Button>
        </div>

        <Divider />

        <h2>playlist</h2>

        <div>
          <Button onClick={this.syncPlaylist}
            loading={syncing}
            disabled={authState !== AuthorizedState.Authorized}
            icon labelPosition="left">
            <Icon name="sync" />
            sync
          </Button>
          <Button onClick={this.shufflePlaylist} icon labelPosition="left">
            <Icon name="shuffle" />
            shuffle
            </Button>
        </div>

        <Divider />

        <h2>reset</h2>
        <Button onClick={this.resetDB}>reset db</Button>

        <Divider />

        <h2>dev</h2>
      </div >
    );
  }
}
