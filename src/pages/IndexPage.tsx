import { useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonOr,
  Form,
  FormField,
  Icon,
} from "semantic-ui-react";
import hasukiLogo from "../assets/hero.webp";
import { parseYouTubeUrl } from "../links.js";

export const IndexPage = () => {
  // TODO: form library?
  const [playlistId, setPlaylistId] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");

  const onChange_playlist = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    setPlaylistId(text);
  };

  const onChange_video = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    setVideoId(text);
  };

  const onChange_youtubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    setYoutubeUrl(text);

    const parsed = parseYouTubeUrl(text);
    if (parsed) {
      if (parsed.playlistId) {
        setPlaylistId(parsed.playlistId);
      }
      if (parsed.videoId) {
        setVideoId(parsed.videoId);
      }
    } else {
      setPlaylistId("");
      setVideoId("");
    }
  };

  const handleReset = () => {
    setPlaylistId("");
    setVideoId("");
    setYoutubeUrl("");
  };

  const redirect = (search: URLSearchParams) => {
    const baseUrl = import.meta.env.BASE_URL;
    const q = search.toString();
    const nextUrl = `${baseUrl}?${q}`;
    window.location.href = nextUrl;
  };

  const handlePlay = () => {
    const search = new URLSearchParams();
    if (playlistId) {
      search.append("list", playlistId);
    }
    if (videoId) {
      search.append("v", videoId);
    }

    if (search.size === 0) {
      // TODO: 입력 에러를 밖으로 보여주기?
      console.log("no input");
      return;
    }

    return redirect(search);
  };

  const enabled_play = playlistId || videoId;
  const enabled_reset = playlistId || videoId || youtubeUrl;

  return (
    <>
      <h3>Free YouTube Audio Player</h3>
      <img src={hasukiLogo} className="ui large image" alt="hasuki" />

      <Form>
        <FormField>
          <label>youtube url</label>
          <input
            type="url"
            placeholder="youtube url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            onChange={onChange_youtubeUrl}
            value={youtubeUrl}
          />
        </FormField>

        <FormField>
          <label>playlist id</label>
          <input
            type="text"
            placeholder="youtube playlist id (ex: PLqeVDqAa1AFbY2JCCVapGggt_pbeMIlDX)"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            onChange={onChange_playlist}
            value={playlistId}
          />
        </FormField>

        <FormField>
          <label>video id</label>
          <input
            type="text"
            placeholder="youtube video id (ex: P1cyCAUTWVg)"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            onChange={onChange_video}
            value={videoId}
          />
        </FormField>

        <ButtonGroup>
          <Button positive onClick={handlePlay} disabled={!enabled_play}>
            <Icon name="music" />
            play
          </Button>

          <ButtonOr />

          <Button
            type="reset"
            negative
            onClick={handleReset}
            disabled={!enabled_reset}
          >
            <Icon name="trash" />
            reset
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};
