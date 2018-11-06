import * as React from 'react';
import { SheetProvider } from './SheetProvider';
import App from './App';

export class Root extends React.Component {
  public render() {
    return (
      <SheetProvider>
        <App />
      </SheetProvider>
    );
  }
}
