import { useEffect, useRef, useState } from "react";
import ReactPlayerPkg from "react-player";
import { OnProgressProps } from "react-player/base.js";
import * as R from "remeda";
import { Image } from "semantic-ui-react";
import { useMediaMeta, useMediaSession } from "use-media-session";
import { RedirectFn } from "../routes.js";
import {
  PlayerTag,
  Playlist,
  Thumbnail,
  playerTag_music,
  playerTag_plain,
} from "../types.js";
import { ErrorProps, ErrorView } from "./ErrorView.js";
import { MyPlayerController } from "./MyPlayerController.js";
import { MyPlayerStrategy_Plain } from "./MyPlayerStrategy_Plain.js";
import {
  MyPlayerStrategy_YouTubeMusic,
  PlayerProps,
} from "./MyPlayerStrategy_YouTubeMusic.js";
import { PlaylistView } from "./PlaylistView.js";
import { MediaLink } from "./links.js";

type Props = {
  redirect: RedirectFn;
  autoplay: boolean;
  playlist: Playlist;
};

export const MyPlayer = (props: Props) => {
  const { playlist, autoplay } = props;

  const ref = useRef<ReactPlayerPkg.default>(null);

  // shuffle 필요해서 상세 목록은 data에서 직접 쓰지 않는다
  const [videos, setVideos] = useState(playlist.videos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // error는 진짜 error와 헷갈릴수 있어서 이름 바꿈
  // audio url에서 403 발생한 다음에 DOMException: Failed to load because no supported source was found 가 발생할수 있다.
  // 에러는 배열이 되어야한다.
  const [exceptions, setExceptions] = useState<ErrorProps[]>([]);

  const [playerMode, setPlayerMode] = useState<PlayerTag>(playerTag_music);

  // 실사용에서는 true가 편한데 개발할때 true면 뭐 고칠떄마다 새로고침되서 false가 낫다.
  const [playing, setPlaying] = useState(autoplay);

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

    const toArtwork = (data: Thumbnail) => {
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

    const m: MediaMetadataOptions = {
      title: video.title,
      artwork: video.thumbnail ? [toArtwork(video.thumbnail)] : undefined,
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
    if (playlist.mix) {
      onEnded_YouTubeMix();
    } else {
      onEnded_Normal();
    }
  };

  const onEnded_Normal = () => {
    const nextIdx = currentVideoIndex + 1;
    if (nextIdx >= videos.length) {
      // 플레이리스트 loop는 고려하지 않았다.
      setPlaying(false);
    } else {
      setCurrentVideoIndex(nextIdx);
    }
  };

  const onEnded_YouTubeMix = () => {
    const nextIdx = currentVideoIndex + 1;
    const next = videos.at(nextIdx);

    // 마지막 곡을 재생할때가 되면 플레이리스트 교체
    // 마지막 곡이 새로운 플레이리스트의 첫번째 곡이 된다.
    const last = videos.at(videos.length - 1);

    if (last && last === next) {
      handleYouTubeMix(last?.id);
    } else {
      setCurrentVideoIndex(nextIdx);
    }
  };

  const onReady = (player: ReactPlayerPkg.default) => {
    const data = {
      url: player.props.url,
    };
    console.log("onReady", data);

    setExceptions([]);
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
    const e = { error, data, hlsInstance, hlsGlobal };
    console.log("onError", e);

    setExceptions([...exceptions, e]);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(e.target.valueAsNumber);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setPlayed(v);
  };

  const handleSeekStart = (target: HTMLInputElement) => {
    setSeeking(true);
  };

  const handleSeekEnd = (target: HTMLInputElement) => {
    setSeeking(false);
    const v = parseFloat(target.value);
    ref.current?.seekTo(v, "fraction");
  };

  const swapPlayerMode = () => {
    const list = [playerTag_music, playerTag_plain] as const;
    const idx = list.findIndex((x) => x === playerMode) ?? 0;
    const next = (idx + 1) % list.length;
    setPlayerMode(list[next]);
  };

  const handleYouTubeMix = (v: string) => {
    props.redirect({
      list: playlist.id,
      v: v,
      autoplay: playing,
    });
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
      {exceptions.map((m, idx) => {
        const key = `${idx}`;
        return <ErrorView key={key} {...m} />;
      })}

      {/* youtube */}
      {video.provider === "yt" && playerMode === playerTag_plain ? (
        <MyPlayerStrategy_Plain ref={ref} {...playerProps} />
      ) : null}
      {video.provider === "yt" && playerMode === playerTag_music ? (
        <MyPlayerStrategy_YouTubeMusic ref={ref} {...playerProps} />
      ) : null}

      {/* soundcloud, ... */}
      {video.provider !== "yt" && (
        <MyPlayerStrategy_Plain ref={ref} {...playerProps} />
      )}

      <div>
        <h3>{video.title}</h3>
        {video.thumbnail ? (
          <Image size="large" src={video.thumbnail.url} alt="thumbnail" />
        ) : null}
      </div>
      <p>
        <span>
          video: <MediaLink {...video} />
        </span>
      </p>

      <div>
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

      <PlaylistView
        title={playlist.title}
        items={videos}
        currentIndex={currentVideoIndex}
        onPlayAt={setCurrentVideoIndex}
      />

      <dl>
        <dt>fake</dt>
        <dd>{playlist.fake ? "true" : "false"}</dd>

        <dt>mix</dt>
        <dd>{playlist.mix ? "true" : "nil"}</dd>
      </dl>

      <div>
        <h3>development</h3>
        {playlist.mix ? (
          <button
            onClick={() => {
              const last = videos.at(videos.length - 1);
              if (last) {
                handleYouTubeMix(last.id);
              }
            }}
            type="button"
          >
            mix
          </button>
        ) : null}
      </div>

      {/* TODO: 귀찮아서 대충 때움 */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <MyPlayerController
        onPreviousTrack={handlePreviousTrack}
        onNextTrack={handleNextTrack}
        onPlayPauseToggle={handlePlayPauseToggle}
        onSeekForward={handleSeekForward}
        onSeekBackward={handleSeekBackward}
        onShuffle={handleShuffle}
        title={video.title}
        playing={playing}
        currentTrack={currentVideoIndex}
        trackCount={videos.length}
        played={played}
        duration={duration}
        onSeekChange={handleSeekChange}
        onSeekStart={handleSeekStart}
        onSeekEnd={handleSeekEnd}
        playerMode={playerMode}
        onNextPlayerMode={swapPlayerMode}
      />
    </div>
  );
};
