import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import ReactPlayer from 'react-player';
import {
  SettingsView,
  DebugView,
  PlaylistView,
  PlayerView,
} from './components';
import { SheetProviderProps } from './SheetProvider';
import { Header, Icon, Menu } from 'semantic-ui-react';
import { PlaylistItem, Playlist, getTitle } from './models';
import { makeBlank } from './helpers/store';
import {
  getLinkType,
  LinkType,
  fetchYouTubeFormats,
  getLowFormat,
  getAudioUrl,
  getYouTubeVideoId,
} from './helpers';

type MenuKeys = 'playlist' | 'settings' | 'dev';

interface State {
  url?: string;
  baseUrl?: string;
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  loop: boolean;
  seeking?: boolean;
  // TODO
  cursor: number;
  activeItem: MenuKeys;

  playlist: Playlist;
}

export type PlayerState = State;

class App extends React.Component<SheetProviderProps, State> {
  private player: ReactPlayer;

  public state: State = {
    playing: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    loop: false,
    cursor: 0,
    activeItem: 'playlist',
    playlist: makeBlank(),
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

    // 첫번째 곡 연결시키기
    // this.load(sampleUrls[0]);
  }

  public componentWillUnmount() {
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }
  }

  private getUrl = async (item: PlaylistItem) => {
    const linktype = getLinkType(item.url);
    if (linktype === LinkType.YouTube) {
      const videoId = getYouTubeVideoId(item.url) as string;
      const formats = await fetchYouTubeFormats(videoId);
      const format = getLowFormat(formats);

      if (!format) { return; }
      return getAudioUrl(format);

    } else {
      return item.url;
    }
  }

  public load = async (item?: PlaylistItem) => {
    if (!item) { return; }

    const url = await this.getUrl(item);
    this.setState({
      url,
      baseUrl: item.url,
      played: 0,
      loaded: 0,
    });

    const r = Math.floor(Math.random() * 100);
    if (navigator.mediaSession) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: getTitle(item),
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
    this.setState({
      url: undefined,
      baseUrl: undefined,
      playing: false,
    });
  }
  // private toggleLoop = () => {
  //   this.setState({ loop: !this.state.loop });
  // }
  private setVolume = (volume: number) => {
    this.setState({ volume });
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
  private onProgress = (state: {
    played: number,
    playedSeconds: number,
    loaded: number,
    loadedSeconds: number,
  }) => {
    // console.log('onProgress', state);
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState({
        played: state.played,
        loaded: state.loaded,
      });
    }
  }

  private nextTrack = () => {
    this.setState({ url: undefined, playing: false });

    const { cursor, playlist } = this.state;
    const next = cursor + 1;
    const item = playlist.get(next);
    this.load(item);

    this.setState({ cursor: next, playing: true });
  }

  private previousTrack = () => {
    this.setState({ url: undefined, playing: false });

    const { cursor, playlist } = this.state;
    const next = cursor - 1;
    const item = playlist.get(next);
    this.load(item);

    this.setState({ cursor: next, playing: true });
  }

  private onEnded = () => {
    console.log('onEnded');

    const { cursor, playlist } = this.state;
    const next = cursor + 1;
    const item = playlist.get(next);
    this.load(item);

    this.setState({ cursor: next, playing: true });
  }

  private onDuration = (duration: number) => {
    console.log('onDuration', duration);
    this.setState({ duration });
  }

  private updatePlaylist = (playlist: Playlist) => {
    this.setState({ playlist });

    if (playlist.length > 0) {
      const item = playlist.get(0);
      this.load(item);
    }
  }

  // private renderLoadButton = (url: string, label: string) => {
  //   return (
  //     <button onClick={() => this.load(url)}>
  //       {label}
  //     </button>
  //   );
  // }

  private handleMenuItemClick = (
    e: any,
    { name }: { name: MenuKeys },
  ) => this.setState({ activeItem: name })

  private ref = (player: ReactPlayer) => {
    this.player = player;
  }

  public render() {
    const {
      url,
      baseUrl,
      playing,
      volume,
      muted,
      loop,
      activeItem,
      playlist,
    } = this.state;

    const linktype = baseUrl ? getLinkType(baseUrl) : LinkType.None;
    const playerHeight = linktype === LinkType.None || linktype === LinkType.YouTube
      ? 0
      : '100%';

    return (
      <div>
        <Header as="h2">
          <Icon name="music" />
          <Header.Content>
            Hasuki
          <Header.Subheader>Audio Player</Header.Subheader>
          </Header.Content>
        </Header>

        <div className="player-wrapper">
          <ReactPlayer
            ref={this.ref}
            className="react-player"
            width={playerHeight}
            height="0"
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

        <PlayerView
          {...this.state}
          stop={this.stop}
          playPause={this.playPause}
          previousTrack={this.previousTrack}
          nextTrack={this.nextTrack}
        />

        <Menu pointing secondary icon size="mini">
          <Menu.Item
            name="playlist"
            active={activeItem === 'playlist'}
            onClick={this.handleMenuItemClick}>
            <Icon name="list" />
          </Menu.Item>
          <Menu.Item
            name="settings"
            active={activeItem === 'settings'}
            onClick={this.handleMenuItemClick} >
            <Icon name="setting" />
          </Menu.Item>
          <Menu.Item
            name="dev"
            active={activeItem === 'dev'}
            onClick={this.handleMenuItemClick}>
            <Icon name="code" />
          </Menu.Item>
        </Menu>

        <div hidden={activeItem !== 'playlist'}>
          <PlaylistView playlist={playlist} />
        </div>

        <div hidden={activeItem !== 'settings'}>
          <SettingsView {...this.props}
            updatePlaylist={this.updatePlaylist} />
        </div>

        <div hidden={activeItem !== 'dev'}>
          <DebugView {...this.state}
            setVolume={this.setVolume}
            toggleMuted={this.toggleMuted}
            onSeekMouseDown={this.onSeekMouseDown}
            onSeekMouseUp={this.onSeekMouseUp}
            onSeekChange={this.onSeekChange} />
        </div>
      </div>
    );
  }
}

export default App;
