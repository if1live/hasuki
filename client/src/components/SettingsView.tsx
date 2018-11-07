import * as React from 'react';
import { SheetProviderProps, AuthorizedState } from 'src/SheetProvider';
import { Button, Divider } from 'semantic-ui-react';
import { Playlist, fetchPlaylist, DEFAULT_PLAYLIST_NAME } from 'src/models';



interface Props {
  updatePlaylist: (playlist: Playlist) => void;
}

interface State {
  syncing: boolean;
}

export class SettingsView extends React.Component<Props & SheetProviderProps, State> {
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
        <div hidden={authState !== AuthorizedState.NotAuthorized}>
          <Button onClick={authClicked}>authorize</Button>
        </div>

        <div hidden={authState !== AuthorizedState.Authorized}>
          <Button onClick={signoutClicked}>signout</Button>
        </div>

        <Divider />

        <h2>Playlist</h2>
        <div hidden={authState !== AuthorizedState.Authorized}>
          <Button onClick={this.syncPlaylist}
            loading={syncing}>
            sync Playlist
          </Button>
        </div>
        <Button onClick={this.shufflePlaylist}>shuffle Playlist</Button>

        <Divider />

        <h2>reset</h2>
        <Button onClick={this.resetDB}>reset db</Button>

        <Divider />

        <h2>dev</h2>
      </div>
    );
  }
}
