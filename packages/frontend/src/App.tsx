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
import { StringParam, useQueryParam } from "use-query-params";
import "./App.css";
import { Duration } from "./Duration";
import hasukiLogo from "./assets/hero.webp";
import { PlaylistItem, fetcher_audio, fetcher_playlist } from "./fetchers";

function App() {
  const ref = useRef<ReactPlayer>(null);

  // TODO: video 하나만 받는 경우는 어떻게 처리하지?
  // 플레이어 구현이 2개가 되는게 낫나? 가짜 playlist 처리할까?
  const [playlistId, setPlaylistId] = useQueryParam("playlist", StringParam);
  const [videoId, setVideoId] = useQueryParam("video", StringParam);

  const { data, error, isLoading } = useSWR(playlistId, fetcher_playlist);

  // shuffle 필요해서 상세 목록은 data에서 직접 쓰지 않는다
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  type MediaMetadataOptions = Parameters<typeof useMediaMeta>[0];
  const [metadata, setMetadata] = useState<MediaMetadataOptions>({});

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

      // audio
      const format = R.pipe(
        resp.formats,
        R.filter((x) => x.audioQuality === "AUDIO_QUALITY_MEDIUM"),
        R.sortBy((x) => x.audioBitrate),
        R.first(),
      );
      if (format === undefined) {
        throw new Error("no audio format fond");
      }
      setUrl(format.url);

      // metadata
      const artwork = resp.videoDetails.thumbnails.map((data) => {
        let type = undefined;
        if (data.url.endsWith(".png")) {
          type = "image/png";
        } else if (data.url.endsWith(".jpg") || data.url.endsWith(".jpeg")) {
          type = "image/jpg";
        }

        return {
          src: data.url,
          sizes: `${data.width}x${data.height}`,
          type,
        };
      });
      const m: MediaMetadataOptions = {
        title: resp.videoDetails.title,
        artwork,
      };
      setMetadata(m);
    }

    execute().then(
      () => {},
      (e) => {
        console.error(e);
      },
    );
  }, [currentAudioIndex, playlistItems]);

  // 플레이어 구현
  const handleNextTrack = () => {
    if (currentAudioIndex < playlistItems.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
    }
  };

  const handlePreviousTrack = () => {
    if (currentAudioIndex >= 1) {
      setCurrentAudioIndex(currentAudioIndex - 1);
    }
  };

  const handleSeekBackward = () => {
    if (!ref.current) return;

    const t = ref.current.getCurrentTime();
    ref.current.seekTo(t - 15, "seconds");
  };

  const handleSeekForward = () => {
    if (!ref.current) return;

    const t = ref.current.getCurrentTime();
    ref.current.seekTo(t + 15, "seconds");
  };

  const handlePlayPauseToggle = () => {
    setPlaying(!playing);
  };

  const handleShuffle = () => {
    const items = R.pipe(data?.items ?? [], R.shuffle());
    setPlaylistItems(items);

    setCurrentAudioIndex(0);
    setPlaying(false);
  };

  const handlePlayIndex = (
    event: React.MouseEvent<HTMLButtonElement>,
    input: ButtonProps,
  ) => {
    const id = parseInt(input["data-id"], 10);
    const idx = playlistItems.findIndex((x) => x.id === id);
    setCurrentAudioIndex(idx);
    setPlaying(true);
  };

  useMediaSession({
    onSeekBackward: handleSeekBackward,
    onSeekForward: handleSeekForward,
    onNextTrack: handleNextTrack,
    onPreviousTrack: handlePreviousTrack,
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    // onStop: () => setPlaying(false),
  });
  useMediaMeta(metadata);

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
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      setLoaded(state.loaded);
      setPlayed(state.played);
    }
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

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setPlayed(v);
  };

  const handleSeekMouseDown = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    setSeeking(false);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const v = parseFloat((e.target as any).value);
    ref.current?.seekTo(v, "fraction");
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
      <img src={hasukiLogo} className="ui large image" alt="hasuki" />

      {playlistId || videoId ? (
        <ul>
          <li>playlist: {playlistId ?? "[BLANK]"}</li>
          <li>video: {videoId ?? "[BLANK]"}</li>
        </ul>
      ) : (
        <ul>
          <li>query: playlist=[youtube_playlist_id]</li>
          <li>query: video=[youtube_video_id]</li>
        </ul>
      )}

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
        <Button icon onClick={handlePreviousTrack}>
          <Icon name="step backward" />
        </Button>
        <Button icon onClick={handleSeekBackward}>
          <Icon name="backward" />
        </Button>
        <Button icon positive onClick={handlePlayPauseToggle}>
          {playing ? <Icon name="pause" /> : <Icon name="play" />}
        </Button>
        <Button icon onClick={handleSeekForward}>
          <Icon name="forward" />
        </Button>
        <Button icon onClick={handleNextTrack}>
          <Icon name="step forward" />
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
                    onClick={handlePlayIndex}
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
