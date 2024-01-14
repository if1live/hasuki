import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { useQueryParams } from "use-query-params";
import "./App.css";
import { MediaLink, PlaylistLink } from "./components/index.js";
import { ExamplePage } from "./pages/ExamplePage.js";
import { IndexPage } from "./pages/IndexPage.js";
import { PlaylistPage } from "./pages/PlaylistPage.js";
import { SinglePage } from "./pages/SinglePage.js";
import { RedirectFn, myQueryParams } from "./routes.js";

function App() {
  // TODO: 새로고침 없이 이동하는 방법?
  // youtube와 동일한 key 사용

  // react-router 안쓰고 query string 손대는 편법
  // https://github.com/pbeshai/use-query-params/issues/237#issuecomment-1825975483
  const [query, setQuery] = useQueryParams(myQueryParams);
  const { list: playlistId, v: videoId, player: playerTag, flag, note } = query;
  const [loc, setLocation] = useState(location.search);

  const setQueryParams: RedirectFn = (params) => {
    setQuery(params);
    setLocation(location.search);
  };

  useEffect(() => {
    const updateLocation = () => setLocation(location.search);
    window.addEventListener("popstate", updateLocation);
    return () => window.removeEventListener("popstate", updateLocation);
  }, []);

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

      {page_index && <IndexPage redirect={setQueryParams} />}
      {playlistId && (
        <PlaylistPage
          playlistId={playlistId}
          videoId={videoId}
          redirect={setQueryParams}
        />
      )}
      {videoId && !playlistId && (
        <SinglePage videoId={videoId} redirect={setQueryParams} />
      )}

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
