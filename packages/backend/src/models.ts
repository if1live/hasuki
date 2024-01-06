import { Selectable } from "kysely";
import { Playlist, PlaylistItem } from "./tables/codegen.js";

export type PlaylistItemModel = Selectable<PlaylistItem>;
export type PlaylistModel = Selectable<Playlist>;
