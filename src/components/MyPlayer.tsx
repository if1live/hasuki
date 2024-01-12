import { useEffect, useRef, useState } from "react";
import ReactPlayerPkg from "react-player";
import { OnProgressProps } from "react-player/base.js";
import * as R from "remeda";
import {
  Button,
  ButtonProps,
  Icon,
  Image,
  Table,
  TableRow,
} from "semantic-ui-react";
import { useMediaMeta, useMediaSession } from "use-media-session";
import {
  PlayerTag,
  Playlist,
  Thumbnail,
  playerTag_music,
  playerTag_plain,
} from "../types.js";
import { Duration } from "./Duration.js";
import { PlainPlayer } from "./PlainPlayer.js";
import { PlayerButtonGroup } from "./PlayerButtonGroup.js";
import { PlayerProps, YouTubeMusicPlayer } from "./YouTubeMusicPlayer.js";
import { VideoLink } from "./links.js";

type Props = {
  playlist: Playlist;
  player: PlayerTag;
};

export const MyPlayer = (props: Props) => {
  const { playlist, player } = props;

  const ref = useRef<ReactPlayerPkg.default | null>(null);

  // shuffle 필요해서 상세 목록은 data에서 직접 쓰지 않는다
  const [videos, setVideos] = useState(playlist.videos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  type MediaMetadataOptions = Parameters<typeof useMediaMeta>[0];
  const [metadata, setMetadata] = useState<MediaMetadataOptions>({});

  // metadata 교체
  useEffect(() => {
    const video = videos.at(currentVideoIndex);
    if (!video) {
      return;
    }

    const fn_artwork = (data: Thumbnail) => {
      const url = data.url;

      let type = undefined;
      if (url.endsWith(".png")) {
        type = "image/png";
      } else if (url.endsWith(".jpg") || url.endsWith(".jpeg")) {
        type = "image/jpg";
      }

      return {
        src: url,
        sizes: `${data.width}x${data.height}`,
        type,
      };
    };

    const artwork = fn_artwork(video.thumbnail);
    const m: MediaMetadataOptions = {
      title: video.title,
      artwork: [artwork],
    };
    setMetadata(m);
  }, [currentVideoIndex, videos]);

  // 플레이어 구현
  const handleNextTrack = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePreviousTrack = () => {
    if (currentVideoIndex >= 1) {
      setCurrentVideoIndex(currentVideoIndex - 1);
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
    const items = R.pipe(playlist.videos, R.shuffle());
    setVideos(items);

    setPlaying(false);
    setCurrentVideoIndex(0);
  };

  const handlePlayIndex = (
    event: React.MouseEvent<HTMLButtonElement>,
    input: ButtonProps,
  ) => {
    const id = input["data-id"];
    const idx = videos.findIndex((x) => x.id === id);

    setCurrentVideoIndex(idx);
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
    const nextIdx = currentVideoIndex + 1;
    if (nextIdx >= videos.length) {
      // 플레이리스트 loop는 고려하지 않았다.
      setPlaying(false);
    } else {
      setCurrentVideoIndex(nextIdx);
    }
  };

  const onReady = () => {
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
    const v = parseFloat((e.target as any).value);
    ref.current?.seekTo(v, "fraction");
  };

  const video = videos.at(currentVideoIndex);
  if (!video) {
    return <div>no video</div>;
  }

  const playerProps: PlayerProps = {
    video,
    playing,
    setPlaying,
    volume,
    onEnded,
    onReady,
    onProgress,
    onSeek,
    onError,
    onDuration,
  };

  return (
    <div>
      {player === playerTag_plain ? (
        <PlainPlayer ref={ref as any} {...playerProps} />
      ) : null}
      {player === playerTag_music ? (
        <YouTubeMusicPlayer ref={ref as any} {...playerProps} />
      ) : null}

      <div>
        <h3>{video.title}</h3>
        <Image size="large" src={video.thumbnail.url} alt="thumbnail" />
      </div>
      <p>
        <span>
          video: <VideoLink videoId={video.id} />
        </span>
        <br />
        <Duration seconds={duration * played} /> |{" "}
        <Duration seconds={duration * (1 - played)} /> |{" "}
        <Duration seconds={duration} />
      </p>
      <PlayerButtonGroup
        onPreviousTrack={handlePreviousTrack}
        onNextTrack={handleNextTrack}
        onPlayPauseToggle={handlePlayPauseToggle}
        onSeekForward={handleSeekForward}
        onSeekBackward={handleSeekBackward}
        onShuffle={handleShuffle}
        playing={playing}
        currentTrack={currentVideoIndex}
        trackCount={videos.length}
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
          <label>Volume: {volume.toFixed(3)}</label>
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
          <label>Played: {played.toFixed(3)}</label>
          <progress max={1} value={played} style={{ width: "100%" }} />
        </div>

        <div>
          <label>Loaded: {loaded.toFixed(3)}</label>
          <progress max={1} value={loaded} style={{ width: "100%" }} />
        </div>
      </div>
      <Table compact="very" size="small" selectable unstackable>
        <Table.Header>
          <TableRow>
            <th>
              {playlist.title} ({currentVideoIndex + 1}/{videos.length})
            </th>
            <th>duration</th>
            <th>action</th>
          </TableRow>
        </Table.Header>
        <Table.Body>
          {videos.map((item, idx) => {
            const active = currentVideoIndex === idx;
            return (
              <TableRow key={item.id} positive={active}>
                <td>
                  {item.title}
                  <br />
                  <VideoLink videoId={item.id} />
                </td>
                <td>{item.durationFormatted}</td>
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
    </div>
  );
};
