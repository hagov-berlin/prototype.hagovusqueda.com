export type Subtitle = [string, number, number];
export type VideoId = string;

const shows = ["EO", "DI", "HYF", "HAA", "ESPECIAL", "CS", "SCDY", "EEC", "BG"] as const;

export type Show = (typeof shows)[number];

export function isShow(showString: string): showString is Show {
  return !!shows.find((show) => show === showString);
}

export type Video = {
  videoId: VideoId;
  duration: `${number}:${number}:${number}` | `${number}:${number}`;
  subtitles: Subtitle[];
  title: string;
  date: string;
  show: Show;
};

// Diff is only conceptual.
// Result is used in the client and doesn't have the full list of subtitles (only the matched subtitles)
export type Result = Video;

export type HagovSearchParams = {
  searchTerm: string;
  show: Show;
  matchWholeWords: boolean;
  ignoreAccents: boolean;
  dateFrom?: string;
  dateUntil?: string;
};

export type SearchResult = {
  results: Result[];
  resultsCapped: boolean;
};
