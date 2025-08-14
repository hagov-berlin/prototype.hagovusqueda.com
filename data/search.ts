"use server";

import { HagovSearchParams } from "@/components/utils";
/* eslint-disable @typescript-eslint/no-require-imports */
import { Video, Result } from "./types";
import { videoList } from "./video-list";

export default async function search(params: HagovSearchParams): Promise<Result[]> {
  const searchRegex = new RegExp(params.searchTerm, "i");
  const results: Result[] = [];

  const videos: Video[] = videoList
    .filter((video) => video.show === (params.show || "HAA"))
    .map((video) => ({
      ...video,
      subtitles: require(`./subtitles_json/${video.videoId}.json`),
    }));

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
