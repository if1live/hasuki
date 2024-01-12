import { Container } from "semantic-ui-react";
import { StringParam, useQueryParam } from "use-query-params";
import "./App.css";
import { PlaylistLink, VideoLink } from "./components/index.js";
import { ExamplePage } from "./pages/ExamplePage.js";
import { IndexPage } from "./pages/IndexPage.js";
import { PlaylistPage } from "./pages/PlaylistPage.js";
import { SinglePage } from "./pages/SinglePage.js";

function App() {
  // youtube와 동일한 key 사용
  const [playlistId, setPlaylistId] = useQueryParam("list", StringParam);
  const [videoId, setVideoId] = useQueryParam("v", StringParam);
  const [playerTag, setPlayerTag] = useQueryParam("player", StringParam);
  const [flag, setFlag] = useQueryParam("flag", StringParam);
  const [note, setNote] = useQueryParam("note", StringParam);

  const page_index = !playlistId && !videoId;
  const player = playerTag || "react-player";

  if (flag === "example") {
    return (
      <Container text>
        <ExamplePage />
      </Container>
    );
  }

  return (
    <Container text>
      {/* TODO: react-router? */}
      <h1>
        <a href="/">hasuki</a>
      </h1>

      <span>
        {playlistId ? (
          <span>
            playlist: <PlaylistLink playlistId={playlistId} />
          </span>
        ) : null}

        {videoId ? (
          <span>
            video: <VideoLink videoId={videoId} />
          </span>
        ) : null}
      </span>

      {page_index && <IndexPage />}
      {playlistId && <PlaylistPage playlistId={playlistId} player={player} />}
      {videoId && <SinglePage videoId={videoId} player={player} />}

      <footer>
        <a href="https://github.com/if1live/hasuki">github</a>
      </footer>
    </Container>
  );
}

export default App;
