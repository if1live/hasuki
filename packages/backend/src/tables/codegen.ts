import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Author = {
  id: Generated<number>;
  url: string;
  channelId: string;
  name: string;
  payload: unknown;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};
export type Playlist = {
  id: Generated<number>;
  naiveId: string;
  url: string;
  title: string;
  estimatedItemCount: number;
  views: number;
  lastUpdated: string;
  description: string | null;
  visibility: string;
  payload: unknown;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};
export type PlaylistItem = {
  id: Generated<number>;
  playlistId: number;
  title: string;
  index: number;
  naiveId: string;
  shortUrl: string;
  url: string;
  isLive: number;
  duration: string;
  durationSec: number;
  isPlayable: number;
  payload: unknown;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};
export type User = {
  id: Generated<number>;
  username: string;
  password: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
};
export type DB = {
  author: Author;
  playlist: Playlist;
  playlistItem: PlaylistItem;
  user: User;
};
