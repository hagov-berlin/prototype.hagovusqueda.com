/* eslint-disable @typescript-eslint/no-require-imports */
import { Subtitle, VideoId } from "./types";
import videos from "./videos.json";

export const subtitles = videos.reduce<Record<VideoId, Subtitle[]>>((accum, video) => {
  accum[video.id] = require(`./subtitles_json/${video.id}.json`);
  return accum;
}, {});
