import * as React from 'react';

interface Props {
  played: number;

  onSeekMouseDown: (e: React.MouseEvent<HTMLInputElement>) => void;
  onSeekChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeekMouseUp: (e: any) => void;
}

export class SeekControl extends React.Component<Props> {
  public render() {
    const {
      played,
      onSeekChange,
      onSeekMouseDown,
      onSeekMouseUp,
    } = this.props;

    return (
      <input
        type="range" min={0} max={1} step="any"
        value={played}
        onMouseDown={onSeekMouseDown}
        onChange={onSeekChange}
        onMouseUp={onSeekMouseUp}
      />
    );
  }
}
