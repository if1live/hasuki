import { PlayerState } from 'src/App';
import * as React from 'react';
import {
  VolumeControl,
  SeekControl,
  PlayerStatusViewer,
} from '../components/debug';

interface Props {
  setVolume: (volume: number) => void;
  toggleMuted: () => void;
  onSeekMouseDown: (e: React.MouseEvent<HTMLInputElement>) => void;
  onSeekChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeekMouseUp: (e: any) => void;
}
export class DebugContainer extends React.Component<PlayerState & Props> {
  public render() {
    return (
      <div>
        <h2>volume</h2>
        <VolumeControl {...this.props} />

        <h2>seek</h2>
        <SeekControl {...this.props} />

        <h2>state</h2>
        <PlayerStatusViewer {...this.props} />
      </div>
    );
  }
}
