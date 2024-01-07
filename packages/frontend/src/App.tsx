import { useEffect, useRef, useState } from "react";
import React from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import * as R from "remeda";
import {
  Button,
  ButtonGroup,
  ButtonProps,
  Container,
  Icon,
  Table,
  TableRow,
} from "semantic-ui-react";
import useSWR from "swr";
import { useMediaMeta, useMediaSession } from "use-media-session";
import "./App.css";
import { Duration } from "./Duration";
import { PlaylistItem, fetcher_audio, fetcher_playlist } from "./fetchers";

function App() {
  const ref = useRef<ReactPlayer>(null);

  // TODO: video id/playlist id는 query string 같은거로 얻어야한다
  const [videoId, setVideoId] = useState("video-id");
  const [playlistId, setPlaylistId] = useState("PL0B01335F8E6D9F69");

  const { data, error, isLoading } = useSWR(playlistId, fetcher_playlist);

  // shuffle 필요해서 상세 목록은 data에서 직접 쓰지 않는다
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);

  // youtube audio url에는 유효시간이 있어서 낱개로 처리하는게 낫겠다.
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setPlaylistItems(data?.items ?? []);
  }, [data]);

  useEffect(() => {
    if (playlistItems.length === 0) {
      return;
    }

    async function execute() {
      const item = playlistItems[currentAudioIndex];
      const resp = await fetcher_audio(item.naiveId);
      const format = resp.formats[0];
      setUrl(format.url);
    }
    execute().then(
      () => {},
      () => {},
    );
  }, [currentAudioIndex, playlistItems]);

  useMediaSession({
    onSeekBackward: () => {
      // ref.current.currentTime -= 15;
      console.log("onSeekBackward");
    },
    onSeekForward: () => {
      // ref.current.currentTime += 15;
      console.log("onSeekForward");
    },
    onNextTrack: () => {
      /*
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
        ref.current.play();
      }
      */
      console.log("onNextTrack");
    },
    onPreviousTrack: () => {
      /*
      if (currentVideoIndex) {
        setCurrentVideoIndex(currentVideoIndex - 1);
        ref.current.play();
      }
      */
      console.log("onPreviousTrack");
    },
    onPlay: () => {
      // ref.current.play();
      console.log("onPlay");
    },
    onPause: () => {
      // ref.current.pause();
      console.log("onPause");
    },
    onStop: () => {
      // ref.current.pause();
      console.log("onStop");
    },
  });

  /*
  useMediaMeta({
    title: "currentVideo.name",
    artwork: [
      {
        src: "currentVideo.poster",
        sizes: "100x150",
      },
    ],
  });
  */

  const onEnded = () => {
    const nextIdx = currentAudioIndex + 1;
    if (nextIdx >= playlistItems.length) {
      // 플레이리스트 loop는 고려하지 않았다.
      setPlaying(false);
    } else {
      setCurrentAudioIndex(nextIdx);
    }
  };

  const onReady = (player: ReactPlayer) => {
    console.log("onReady");
  };

  const onProgress = (state: OnProgressProps) => {
    setLoaded(state.loaded);
    setPlayed(state.played);
  };

  const onSeek = (seconds: number) => {
    console.log("onSeek", seconds);
  };

  const onDuration = (duration: number) => {
    setDuration(duration);
  };

  const onError = (
    error: unknown,
    data?: unknown,
    hlsInstance?: unknown,
    hlsGlobal?: unknown,
  ) => {
    console.log("onError");
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(e.target.valueAsNumber);
  };

  // TODO: seek?
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setState({ played: parseFloat(e.target.value) });
  };

  // TODO: seek?
  const handleSeekMouseDown = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    // this.setState({ seeking: true });
  };

  // TODO: seek?
  const handleSeekMouseUp = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    // this.setState({ seeking: false });
    // this.player.seekTo(parseFloat(e.target.value));
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleBackward = () => {
    console.log("handleBackward");
  };
  const handleForward = () => {
    console.log("handleForward");
  };

  const handleStepBackward = () => {
    console.log("handleStepBackward");
  };
  const handleStepForward = () => {
    console.log("handleStepBackward");
  };

  const handleShuffle = () => {
    const items = R.pipe(data?.items ?? [], R.shuffle());
    setPlaylistItems(items);

    // TODO: 처음곡부터 다시 재생?
    setCurrentAudioIndex(0);
  };

  const handlePlay = (
    event: React.MouseEvent<HTMLButtonElement>,
    input: ButtonProps,
  ) => {
    const id = parseInt(input["data-id"], 10);
    const idx = playlistItems.findIndex((x) => x.id === id);
    setCurrentAudioIndex(idx);
  };

  if (error) {
    return <div>failed to load</div>;
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <Container text>
      <h1>hasuki</h1>

      <ReactPlayer
        ref={ref}
        playing={playing}
        url={url}
        volume={volume}
        onEnded={onEnded}
        onReady={onReady}
        onProgress={onProgress}
        onSeek={onSeek}
        onError={onError}
        onDuration={onDuration}
        height={0}
        config={{
          file: {
            forceAudio: true,
          },
        }}
      />

      <div>
        <div>
          <label>Seek</label>
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            width="100%"
            step="any"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Played</label>
          <progress max={1} value={played} style={{ width: "100%" }} />
        </div>

        <div>
          <label>Loaded</label>
          <progress max={1} value={loaded} style={{ width: "100%" }} />
        </div>
      </div>

      <ButtonGroup>
        <Button icon onClick={handleBackward}>
          <Icon name="backward" />
        </Button>
        <Button icon onClick={handleStepBackward}>
          <Icon name="step backward" />
        </Button>
        <Button icon positive onClick={handlePlayPause}>
          {playing ? <Icon name="pause" /> : <Icon name="play" />}
        </Button>
        <Button icon onClick={handleStepForward}>
          <Icon name="step forward" />
        </Button>
        <Button icon onClick={handleForward}>
          <Icon name="forward" />
        </Button>
        <Button icon onClick={handleShuffle}>
          <Icon name="shuffle" />
        </Button>
      </ButtonGroup>

      <Table compact="very" size="small" selectable>
        <Table.Header>
          <TableRow>
            <th>title</th>
            <th>duration</th>
            <th>action</th>
          </TableRow>
        </Table.Header>
        <Table.Body>
          {playlistItems.map((item, idx) => {
            const active = currentAudioIndex === idx;
            return (
              <TableRow key={item.id} positive={active}>
                <td>{item.title}</td>
                <td>{item.duration}</td>
                <td>
                  <Button
                    size="mini"
                    icon
                    onClick={handlePlay}
                    data-id={item.id}
                  >
                    <Icon name="play" />
                  </Button>
                </td>
              </TableRow>
            );
          })}
        </Table.Body>
      </Table>

      <table>
        <tbody>
          <tr>
            <td>url</td>
            <td>
              {url.length > 0 ? (
                <a href={url} target="_blank" rel="noreferrer">
                  link
                </a>
              ) : (
                "none"
              )}
            </td>
          </tr>

          <tr>
            <td>playing</td>
            <td>{playing ? "true" : "false"}</td>
          </tr>

          <tr>
            <td>volume</td>
            <td>{volume.toFixed(3)}</td>
          </tr>

          <tr>
            <td>played</td>
            <td>{played.toFixed(3)}</td>
          </tr>

          <tr>
            <td>loaded</td>
            <td>{loaded.toFixed(3)}</td>
          </tr>

          <tr>
            <td>duration</td>
            <td>
              <Duration seconds={duration} />
            </td>
          </tr>

          <tr>
            <td>elapsed</td>
            <td>
              <Duration seconds={duration * played} />
            </td>
          </tr>

          <tr>
            <td>remaining</td>
            <td>
              <Duration seconds={duration * (1 - played)} />
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
}

export default App;
