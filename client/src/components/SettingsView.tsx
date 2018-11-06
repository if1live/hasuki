import * as React from 'react';
import { SheetProviderProps, AuthorizedState } from 'src/SheetProvider';
import { Button, Divider } from 'semantic-ui-react';
import { SHEET_ID } from 'src/settings';
import { PlayListItem } from 'src/models';

interface Props {

}

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

const makePlayListItem = (row: any[]): PlayListItem => {
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

export class SettingsView extends React.Component<Props & SheetProviderProps> {
  private resetDB = () => {
    console.log('TODO reset db');
  }

  private syncPlaylist = async () => {
    try {
      const response = await makeSheetFetchPromise();
      const range = response.result;
      if (range.values.length > 0) {
        const items = range.values.map(makePlayListItem);
        console.log(items);
      }
      alert(`loaded item: ${range.values.length}`);

    } catch (err) {
      console.error(err);
    }
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

        <h2>playlist</h2>
        <div hidden={authState !== AuthorizedState.Authorized}>
          <Button onClick={this.syncPlaylist}>sync playlist</Button>
        </div>
        <Button onClick={this.shufflePlaylist}>shuffle playlist</Button>

        <Divider />

        <h2>reset</h2>
        <Button onClick={this.resetDB}>reset db</Button>
      </div>
    );
  }
}
