export type Subtitle = [string, number, number];
export type VideoId = string;

export type Video = {
  videoId: VideoId;
  duration: string;
  subtitles: Subtitle[];
  title: string;
  date: string;
  show: "EO" | "DI" | "HYF" | "HAA" | "ESPECIAL" | "CS" | "SCDY" | "EEC" | "BG";
};

// Diff is only conceptual.
// Result is used in the client and doesn't have the full list of subtitles (only the matched subtitles)
export type Result = Video;
