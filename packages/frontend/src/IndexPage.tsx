import { useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonOr,
  Form,
  FormField,
} from "semantic-ui-react";
import hasukiLogo from "./assets/hero.webp";
import { parseYouTubeUrl } from "./links";

export const IndexPage = () => {
  // TODO: form library?
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);

  const onChange_playlist = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    const v = text.length > 0 ? text : null;
    setPlaylistId(v);
  };

  const onChange_video = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    const v = text.length > 0 ? text : null;
    setVideoId(v);
  };

  const onChange_youtubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    const v = text.length > 0 ? text : null;
    setYoutubeUrl(v);
  };

  const handleReset = () => {
    setPlaylistId("");
    setVideoId("");
    setYoutubeUrl("");
  };

  // TODO: query string? redirect?
  const fn_playlist = (id: string) => {
    const search = new URLSearchParams();
    search.append("list", id);
    return fn_redirect(search);
  };

  const fn_video = (id: string) => {
    const search = new URLSearchParams();
    search.append("v", id);
    return fn_redirect(search);
  };

  const fn_redirect = (search: URLSearchParams) => {
    const q = search.toString();
    const nextUrl = `/?${q}`;
    window.location.href = nextUrl;
  };

  const handlePlay = () => {
    let value_playlistId: string | null = playlistId;
    let value_videoId: string | null = videoId;
    if (youtubeUrl) {
      const parsed = parseYouTubeUrl(youtubeUrl);
      if (parsed) {
        value_playlistId = parsed.playlistId ?? null;
        value_videoId = parsed.videoId ?? null;
      }
    }

    if (value_playlistId) {
      return fn_playlist(value_playlistId);
    }
    if (value_videoId) {
      return fn_video(value_videoId);
    }
    // TODO: 입력 에러를 밖으로 보여주기?
    console.log("no input");
  };

  return (
    <>
      <img src={hasukiLogo} className="ui large image" alt="hasuki" />

      <Form>
        <FormField>
          <label>playlist id</label>
          <input
            type="text"
            placeholder="youtube playlist id"
            onChange={onChange_playlist}
            value={playlistId ?? ""}
          />
        </FormField>

        {/* <FormField>
          <label>video id</label>
          <input
            type="text"
            placeholder="youtube video id"
            onChange={onChange_video}
            value={videoId ?? ""}
          />
        </FormField> */}

        <FormField>
          <label>youtube url</label>
          <input
            type="url"
            placeholder="youtube url"
            onChange={onChange_youtubeUrl}
            value={youtubeUrl ?? ""}
          />
        </FormField>

        <ButtonGroup>
          <Button positive onClick={handlePlay}>
            play
          </Button>

          <ButtonOr />

          <Button type="reset" negative onClick={handleReset}>
            reset
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};
