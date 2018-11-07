import * as React from 'react';

interface Props {
  volume: number;
  muted: boolean;
  setVolume: (vol: number) => void;
  toggleMuted: () => void;
}

export class VolumeControl extends React.Component<Props> {
  private setVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    this.props.setVolume(v);
  }

  public render() {
    const {
      volume,
      muted,
      toggleMuted,
    } = this.props;

    return (
      <div>
        <div>
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={volume}
            onChange={this.setVolume}
          />
        </div>
        <div>
          <label htmlFor="muted">Muted</label>
          <input
            id="muted"
            type="checkbox"
            checked={muted}
            onChange={toggleMuted}
          />
        </div>
      </div>
    );
  }
}
