export interface PlaylistItem {
  url: string;
  title?: string;
  milliseconds?: number;
}

// TODO interface + 함수 조합을 어떻게 하는게 나으려나
export const getTitle = (item?: PlaylistItem) => {
  const empty = '[BLANK]';
  if (!item) { return empty; }
  return item.title ? item.title : empty;
};
