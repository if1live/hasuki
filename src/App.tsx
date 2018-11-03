import * as React from 'react';
import ReactPlayer from 'react-player';
import Duration from './Duration';

const sampleUrls = [
  'https://soundcloud.com/kaochan194/sets/yosuga-no-sora-ost',
  'https://www.youtube.com/watch?v=xxOcLcPrs2w',
  'http://www.largesound.com/ashborytour/sound/brobob.mp3',
  'http://www.music.helsinki.fi/tmt/opetus/uusmedia/esim/a2002011001-e02.wav',
];

class App extends React.Component {
  private player: ReactPlayer;

  public state = {
    url: undefined as (string | undefined),
    playing: true,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    loop: false,
    seeking: undefined,
    playIndex: 0,
  };

  public componentDidMount() {
    if (navigator.mediaSession) {
      // navigator.mediaSession.setActionHandler('play', () => { /**/});
      // navigator.mediaSession.setActionHandler('pause', () => { /**/ });
      navigator.mediaSession.setActionHandler('seekbackward', () => { /* Code excerpted. */ });
      navigator.mediaSession.setActionHandler('seekforward', () => { /* Code excerpted. */ });
      navigator.mediaSession.setActionHandler('previoustrack', this.previousTrack);
      navigator.mediaSession.setActionHandler('nexttrack', this.nextTrack);
    }
  }

  public componentWillUnmount() {
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }
  }

  public load = (url: string) => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
    });

    const r = Math.floor(Math.random() * 100);
    if (navigator.mediaSession) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'todo-title',
        artist: 'todo-artist',
        album: 'todo-album',
        artwork: [
          { src: `https://fakeimg.pl/96x96/?text=${r}`, sizes: '96x96', type: 'image/png' },
          { src: `https://fakeimg.pl/128x128/?text=${r}`, sizes: '128x128', type: 'image/png' },
          { src: `https://fakeimg.pl/192x192/?text=${r}`, sizes: '192x192', type: 'image/png' },
          { src: `https://fakeimg.pl/256x256/?text=${r}`, sizes: '256x256', type: 'image/png' },
          { src: `https://fakeimg.pl/384x384/?text=${r}`, sizes: '384x384', type: 'image/png' },
          { src: `https://fakeimg.pl/512x512/?text=${r}`, sizes: '512x512', type: 'image/png' },
        ],
      });
    }
  }

  private playPause = () => {
    this.setState({ playing: !this.state.playing });
  }
  private stop = () => {
    this.setState({ url: null, playing: false });
  }
  private toggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  }
  private setVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ volume: parseFloat(e.target.value) });
  }
  private toggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  }
  private onPlay = () => {
    console.log('onPlay');
    this.setState({ playing: true });

    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('seekbackward', () => { /* Code excerpted. */ });
      navigator.mediaSession.setActionHandler('seekforward', () => { /* Code excerpted. */ });
      navigator.mediaSession.setActionHandler('previoustrack', this.previousTrack);
      navigator.mediaSession.setActionHandler('nexttrack', this.nextTrack);
    }
  }
  private onPause = () => {
    console.log('onPause');
    this.setState({ playing: false });
  }
  private onSeekMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    this.setState({ seeking: true });
  }
  private onSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ played: parseFloat(e.target.value) });
  }
  private onSeekMouseUp = (e: any) => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  }
  private onProgress = (state: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }) => {
    console.log('onProgress', state);
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  }

  private nextTrack = () => {
    this.setState({ url: null, playing: false });
    const curr = this.state.playIndex;
    const next = curr + 1;
    const url = sampleUrls[next % sampleUrls.length];
    this.load(url);
    this.setState({ playIndex: next, playing: true });
  }

  private previousTrack = () => {
    this.setState({ url: null, playing: false });
    const curr = this.state.playIndex;
    const next = curr - 1;
    const url = sampleUrls[next % sampleUrls.length];
    this.load(url);
    this.setState({ playIndex: next, playing: true });
  }

  private onEnded = () => {
    console.log('onEnded');
    const curr = this.state.playIndex;
    const next = curr + 1;
    const url = sampleUrls[next % sampleUrls.length];
    this.load(url);
    this.setState({ playIndex: next, playing: true });
  }

  private onDuration = (duration: number) => {
    console.log('onDuration', duration);
    this.setState({ duration });
  }

  // private renderLoadButton = (url: string, label: string) => {
  //   return (
  //     <button onClick={() => this.load(url)}>
  //       {label}
  //     </button>
  //   );
  // }

  private ref = (player: ReactPlayer) => {
    this.player = player;
  }

  public render() {
    const { url, playing, volume, muted, loop, played, duration, loaded } = this.state;
    // const SEPARATOR = ' · ';

    return (
      <div className="app">
        <section className="section">
          <h1>ReactPlayer Demo</h1>
          <div className="player-wrapper">
            <ReactPlayer
              ref={this.ref}
              className="react-player"
              width="100%"
              height="100%"
              url={url}
              playing={playing}
              loop={loop}
              volume={volume}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onBuffer={() => console.log('onBuffer')}
              onSeek={(e) => console.log('onSeek', e)}
              onEnded={this.onEnded}
              onError={(e) => console.log('onError', e)}
              onProgress={this.onProgress}
              onDuration={this.onDuration}
            />
          </div>

          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={() => {
                  // onError DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
                  this.load(sampleUrls[this.state.playIndex % sampleUrls.length]);
                }}>Play</button>
                <button onClick={this.stop}>Stop</button>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.previousTrack}>previous track</button>
                <button onClick={this.nextTrack}>next track</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type="range" min={0} max={1} step="any"
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type="range" min={0} max={1} step="any" value={volume} onChange={this.setVolume} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="muted">Muted</label>
              </th>
              <td>
                <input id="muted" type="checkbox" checked={muted} onChange={this.toggleMuted} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="loop">Loop</label>
              </th>
              <td>
                <input id="loop" type="checkbox" checked={loop} onChange={this.toggleLoop} />
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td><progress max={1} value={played} /></td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress max={1} value={loaded} /></td>
            </tr>
          </tbody></table>
        </section>
        <section className="section">
          <h2>State</h2>

          <table><tbody>
            <tr>
              <th>url</th>
              <td className={!url ? 'faded' : ''}>
                {url || 'null'}
              </td>
            </tr>
            <tr>
              <th>playing</th>
              <td>{playing ? 'true' : 'false'}</td>
            </tr>
            <tr>
              <th>volume</th>
              <td>{volume.toFixed(3)}</td>
            </tr>
            <tr>
              <th>played</th>
              <td>{played.toFixed(3)}</td>
            </tr>
            <tr>
              <th>loaded</th>
              <td>{loaded.toFixed(3)}</td>
            </tr>
            <tr>
              <th>duration</th>
              <td><Duration seconds={duration} /></td>
            </tr>
            <tr>
              <th>elapsed</th>
              <td><Duration seconds={duration * played} /></td>
            </tr>
            <tr>
              <th>remaining</th>
              <td><Duration seconds={duration * (1 - played)} /></td>
            </tr>
          </tbody></table>
        </section>
      </div>
    );
  }
}

export default App;
