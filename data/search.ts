"use server";

/* eslint-disable @typescript-eslint/no-require-imports */
import { Subtitle, VideoId, Video, Result } from "./types";
import videosJson from "./videos.json";

const videos: Video[] = videosJson.map((video) => ({
  ...video,
  videoId: video.id,
  subtitles: require(`./subtitles_json/${video.id}.json`),
}));

export default async function search(searchTerm: string): Promise<Result[]> {
  const searchRegex = new RegExp(searchTerm, "i");
  const results: Result[] = [];

  for (const video of videos) {
    const matches = video.subtitles.filter((subtitle, index) => {
      const subtitleText = subtitle[0];
      const subtitleMatches = searchRegex.test(subtitleText);
      if (subtitleMatches) return true;

      const nextSubtitleText = video.subtitles[index + 1]?.[0];
      if (!nextSubtitleText) return false;

      const nextSubtitleMatches = searchRegex.test(nextSubtitleText);
      if (nextSubtitleMatches) return false;

      const thisAndNextSubtitleMatches = searchRegex.test(`${subtitleText} ${nextSubtitleText}`);
      return thisAndNextSubtitleMatches;
    });
    if (matches.length) {
      results.push({
        ...video,
        subtitles: matches,
      });
    }
  }
  return results;
}
