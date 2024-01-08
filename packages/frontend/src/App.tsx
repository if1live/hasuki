import { Container } from "semantic-ui-react";
import { StringParam, useQueryParam } from "use-query-params";
import "./App.css";
import { IndexPage } from "./IndexPage";
import { ListPlayer } from "./ListPlayer";
import { SimplePlayer } from "./SimplePlayer";

function App() {
  // youtube와 동일한 key 사용
  const [playlistId, setPlaylistId] = useQueryParam("list", StringParam);
  const [videoId, setVideoId] = useQueryParam("v", StringParam);

  const page_index = !playlistId && !videoId;

  return (
    <Container text>
      {/* TODO: react-router? */}
      <h1>
        <a href="/">hasuki</a>
      </h1>
      <span>
        {playlistId ? (
          <span>
            playlist:
            <a
              href={`https://www.youtube.com/playlist?list=${playlistId}`}
              target="_blank"
              rel="noreferrer"
            >
              {playlistId}
            </a>
          </span>
        ) : null}

        {videoId ? (
          <span>
            video:
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noreferrer"
            >
              {videoId}
            </a>
          </span>
        ) : null}
      </span>

      {page_index && <IndexPage />}
      {playlistId && <ListPlayer playlistId={playlistId} />}
      {videoId && <SimplePlayer videoId={videoId} />}

      <hr />

      <footer>
        <a href="https://github.com/if1live/hasuki">github</a>
      </footer>
    </Container>
  );
}

export default App;
