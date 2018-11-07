import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import ReactPlayer from 'react-player';
import {
  SettingsContainer,
  DebugContainer,
  PlaylistContainer,
  PlayerContainer,
} from './containers';
import { SheetProviderProps } from './SheetProvider';
import { Header, Icon, Menu } from 'semantic-ui-react';
import {
  PlaylistItem,
  Playlist,
  PlaylistItemHolder,
} from './models';
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
  // player
  url?: string;
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  loop: boolean;
  seeking?: boolean;

  // 유튜브는 재생URL와 외부URL이 다르다
  baseUrl?: string;

  // menu
  activeItem: MenuKeys;

  // playlist
  // 플레이리스트가 비어있거나 stop하면 선택된 정보가 날라갈수 있다
  cursor?: number;
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
    cursor: undefined,
    activeItem: 'playlist',
    playlist: makeBlank(),
  };

  public componentDidMount() {
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('play', this.playPause);
      navigator.mediaSession.setActionHandler('pause', this.playPause);
      // navigator.mediaSession.setActionHandler('seekbackward', () => { /* Code excerpted. */ });
      // navigator.mediaSession.setActionHandler('seekforward', () => { /* Code excerpted. */ });
      navigator.mediaSession.setActionHandler('previoustrack', this.previousTrack);
      navigator.mediaSession.setActionHandler('nexttrack', this.nextTrack);
    }

    // 첫번째 곡 연결시키기
    // this.load(sampleUrls[0]);
  }

  public componentWillUnmount() {
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
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
    if (!item) {
      this.stop();
      return;
    }

    const holder = new PlaylistItemHolder(item);
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
        title: holder.displayTitle,
        // 제목 이상의 정보는 믿을게 없더라
        // artist: 'todo-artist',
        // album: 'todo-album',
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
      played: 0,
      loaded: 0,
      cursor: undefined,
    });

    if (navigator.mediaSession) {
      navigator.mediaSession.metadata = null;
    }
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

  private updatePlaylistCursor = (cursor: number) => {
    const { playlist } = this.state;
    const item = playlist.get(cursor);
    this.load(item);
    this.setState({ cursor, playing: true });
  }

  private nextTrack = () => {
    this.stop();
    const { cursor } = this.state;
    if (cursor === undefined) {
      this.updatePlaylistCursor(0);
    } else {
      this.updatePlaylistCursor(cursor + 1);
    }
  }

  private previousTrack = () => {
    this.stop();
    const { cursor } = this.state;
    if (cursor === undefined) {
      this.updatePlaylistCursor(0);
    } else {
      this.updatePlaylistCursor(cursor - 1);
    }
  }

  private onEnded = () => {
    console.log('onEnded');

    const { cursor } = this.state;
    if (cursor === undefined) {
      this.updatePlaylistCursor(0);
    } else {
      this.updatePlaylistCursor(cursor + 1);
    }
  }

  private onDuration = (duration: number) => {
    console.log('onDuration', duration);
    this.setState({ duration });
  }

  private updatePlaylist = (playlist: Playlist) => {
    this.setState({ playlist, cursor: 0 });

    if (playlist.length > 0) {
      const item = playlist.get(0);
      this.load(item);
    }
  }

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
            width="100%"
            height={playerHeight}
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

        <PlayerContainer
          {...this.state}
          stop={this.stop}
          playPause={this.playPause}
          previousTrack={this.previousTrack}
          nextTrack={this.nextTrack}
          updatePlaylistCursor={this.updatePlaylistCursor}
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
          <PlaylistContainer {...this.state}
            updatePlaylistCursor={this.updatePlaylistCursor} />
        </div>

        <div hidden={activeItem !== 'settings'}>
          <SettingsContainer {...this.props}
            updatePlaylist={this.updatePlaylist} />
        </div>

        <div hidden={activeItem !== 'dev'}>
          <DebugContainer {...this.state}
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
