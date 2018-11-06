import * as React from 'react';
import { SheetProviderProps, AuthorizedState } from 'src/SheetProvider';
import { Button, Divider } from 'semantic-ui-react';

interface Props {

}

export class SettingsView extends React.Component<Props & SheetProviderProps> {
  private resetDB = () => {
    console.log('TODO reset db');
  }

  private syncPlaylist = () => {
    console.log('TODO sync db');
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
