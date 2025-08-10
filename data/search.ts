"use server";

import { Result } from "./types";
import { subtitles } from "./subtitles";

export default async function search(searchTerm: string): Promise<Result[]> {
  const searchRegex = new RegExp(searchTerm, "i");
  const results: Result[] = [];
  for (const videoId in subtitles) {
    const matches = subtitles[videoId].filter((subtitle, index) => {
      const subtitleMatches = searchRegex.test(subtitle[0]);
      const thisAndNextSubtitleMatches = searchRegex.test(subtitles[videoId][index + 1]?.[0]);
      return subtitleMatches || thisAndNextSubtitleMatches;
    });
    if (matches.length) {
      results.push({
        videoId,
        subtitles: matches,
      });
    }
  }
  return results;
}
