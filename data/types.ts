export type Subtitle = [string, number, number];
export type VideoId = string;

export type Video = {
  videoId: VideoId;
  subtitles: Subtitle[];
  title: string;
  date: string;
  show: string;
};

// Diff is only conceptual.
// Result is used in the client and doesn't have the full list of subtitles (only the matched subtitles)
export type Result = Video;
