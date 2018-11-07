export interface PlaylistItem {
  url: string;
  title?: string;
  milliseconds?: number;
}

export class PlaylistItemHolder {
  private item: PlaylistItem;

  constructor(item: PlaylistItem) {
    this.item = item;
  }

  public get displayTitle() {
    const empty = '[BLANK]';
    const title = this.item.title;
    return title ? title : empty;
  }
}

