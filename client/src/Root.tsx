import * as React from 'react';
import App from './App';
import { API_KEY, CLIENT_ID } from './settings';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

export enum AuthorizedState {
  NotReady,
  NotAuthorized,
  Authorized,
}

interface State {
  authState: AuthorizedState;
}

export class Root extends React.Component<{}, State> {
  public state = {
    authState: AuthorizedState.NotReady,
  };

  private handleClientLoad = () => {
    const gapi = window.gapi;
    gapi.load('client:auth2', this.initClient);
  }

  private handleAuthClick = () => {
    const gapi = window.gapi;
    gapi.auth2.getAuthInstance().signIn();
  }

  private handleSignoutClick = () => {
    const gapi = window.gapi;
    gapi.auth2.getAuthInstance().signOut();
  }

  private updateSigninStatus = (isSignedIn: boolean) => {
    const authState = isSignedIn
      ? AuthorizedState.Authorized
      : AuthorizedState.NotAuthorized;
    this.setState({ authState });
  }


  private initClient = () => {
    const gapi = window.gapi;
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  public componentDidMount() {
    this.handleClientLoad();
  }

  public render() {
    const { authState } = this.state;
    return (
      <div>
        <App
          authState={authState}
          authClicked={this.handleAuthClick}
          signoutClicked={this.handleSignoutClick}
        />
      </div>
    );
  }
}
