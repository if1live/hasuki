import { Container } from "semantic-ui-react";
import { StringParam, useQueryParam } from "use-query-params";
import "./App.css";
import { MyPlayer } from "./components/MyPlayer.js";
import { MediaLink, PlaylistLink } from "./components/index.js";
import { ExamplePage } from "./pages/ExamplePage.js";
import { IndexPage } from "./pages/IndexPage.js";
import { PlaylistPage } from "./pages/PlaylistPage.js";
import { SinglePage } from "./pages/SinglePage.js";
import { Playlist } from "./types.js";

function App() {
  // TODO: 새로고침 없이 이동하는 방법?
  // youtube와 동일한 key 사용
  const [playlistId, setPlaylistId] = useQueryParam("list", StringParam);
  const [videoId, setVideoId] = useQueryParam("v", StringParam);
  const [playerTag, setPlayerTag] = useQueryParam("player", StringParam);
  const [flag, setFlag] = useQueryParam("flag", StringParam);
  const [note, setNote] = useQueryParam("note", StringParam);

  const page_index = !playlistId && !videoId;

  if (flag === "example") {
    return (
      <Container text>
        <ExamplePage />
      </Container>
    );
  }

  /*
  TODO: 플레이리스트 외부에서 꽂아줄 방법?
  const playlist: Playlist = {
    fake: true,
    id: "",
    channel: {},
    title: "x",
    url: "",
    videos: [
      {
        id: "x",
        duration: 11,
        durationFormatted: "11",
        title: "?",
        provider: "sc",
        url: "https://soundcloud.com/tycho/tycho-awake",
      },
      {
        id: "y",
        duration: 112,
        durationFormatted: "112",
        title: "?aa",
        provider: "sc",
        url: "https://soundcloud.com/moebyni/clannad-dango-daikazoku",
      },
    ],
  };
  */

  return (
    <Container text>
      {/* TODO: react-router? */}
      <h1>
        <a href="/">hasuki</a>
      </h1>

      <p>
        {playlistId ? (
          <span>
            playlist: <PlaylistLink playlistId={playlistId} />
          </span>
        ) : null}
        <br />

        {videoId ? (
          <span>
            video: <MediaLink provider="yt" id={videoId} />
          </span>
        ) : null}
      </p>

      {page_index && <IndexPage />}
      {playlistId && <PlaylistPage playlistId={playlistId} videoId={videoId} />}
      {videoId && !playlistId && <SinglePage videoId={videoId} />}

      {/* <MyPlayer playlist={playlist} /> */}

      <footer>
        <a
          href="https://github.com/if1live/hasuki"
          target="_blank"
          rel="noreferrer"
        >
          github
        </a>
      </footer>
    </Container>
  );
}

export default App;
