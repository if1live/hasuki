import * as React from 'react';
import { SheetProviderProps, AuthorizedState } from 'src/SheetProvider';
import { Button, Divider, Icon } from 'semantic-ui-react';
import {
  Playlist,
  fetchPlaylist,
  shufflePlaylist,
  DEFAULT_PLAYLIST_NAME,
} from 'src/models';
import * as store from 'src/helpers/store';


interface Props {
  updatePlaylist: (playlist: Playlist) => void;
}

interface State {
  syncing: boolean;
  shuffling: boolean;
}

export class SettingsContainer extends React.Component<Props & SheetProviderProps, State> {
  public state = {
    syncing: false,
    shuffling: false,
  };

  private resetDB = async () => {
    await store.clear();
    const playlist = store.makeBlank();

    const { updatePlaylist } = this.props;
    updatePlaylist(playlist);
  }

  private syncPlaylist = async () => {
    this.setState({ syncing: true });

    const { updatePlaylist } = this.props;
    const playlist = await fetchPlaylist(DEFAULT_PLAYLIST_NAME);
    updatePlaylist(playlist);
    await store.synchronize(playlist);

    this.setState({ syncing: false });
  }

  private shufflePlaylist = async () => {
    this.setState({ shuffling: true });

    const { updatePlaylist } = this.props;
    const prev = await store.load();
    const playlist = shufflePlaylist(prev);
    updatePlaylist(playlist);
    await store.synchronize(playlist);

    this.setState({ shuffling: false });
  }

  public render() {
    const {
      authState,
      authClicked,
      signoutClicked,
    } = this.props;
    const { syncing, shuffling } = this.state;

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
          <Button onClick={this.shufflePlaylist}
            loading={shuffling}
            icon
            labelPosition="left">
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
