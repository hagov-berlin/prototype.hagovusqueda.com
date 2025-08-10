export type Subtitle = [string, number, number];
export type VideoId = string;
export type Result = {
  videoId: VideoId;
  subtitles: Subtitle[];
};
