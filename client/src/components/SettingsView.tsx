import * as React from 'react';
import { SheetProviderProps, AuthorizedState } from 'src/SheetProvider';
import { Button, Divider } from 'semantic-ui-react';
import { SHEET_ID, API_SERVER } from 'src/settings';
import { PlaylistItem } from 'src/models';
import { videoFormat } from 'ytdl-core';

const makeSheetFetchPromise = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const gapi = window.gapi;
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'default!A2:C',
    }).then(
      (response: any) => resolve(response),
      (response: any) => reject(response),
    );
  });
};

const makePlaylistItem = (row: any[]): PlaylistItem => {
  const url = row[0] as (string);
  const title = row[1] as (string | undefined);
  const duration = row[2] as (string | undefined);
  let milliseconds: (number | undefined);
  if (duration) {
    milliseconds = parseInt(duration, 10);
  }

  return {
    url, title, milliseconds,
  };
};

interface Props {
  updatePlaylist: (Playlist: PlaylistItem[]) => void;
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
    try {
      const response = await makeSheetFetchPromise();
      const range = response.result;
      if (range.values.length > 0) {
        const items = range.values.map(makePlaylistItem);
        updatePlaylist(items);
      }

    } catch (err) {
      console.error(err);
    }

    this.setState({ syncing: false });
  }

  private shufflePlaylist = () => {
    console.log('TODO shuffle db');
  }

  private fetchYoutube = async () => {
    // TODO 권한 붙이기
    const url = `${API_SERVER}/youtube/audio-url?video_id=iJAxTaT8xJQ`;
    const resp = await fetch(url);
    const data = await resp.json();
    const formats = data as videoFormat[];
    console.log(formats[0].url);
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
        <Button onClick={this.fetchYoutube}>fetch youtube</Button>
      </div>
    );
  }
}
