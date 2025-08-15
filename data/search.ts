"use server";

import { defaultParams } from "@/components/utils";
/* eslint-disable @typescript-eslint/no-require-imports */
import { Video, Result, HagovSearchParams } from "./types";
import { videoList } from "./video-list";

function buildRegex(params: HagovSearchParams) {
  console.log(params);
  const normalizedSearchTerm = params.searchTerm.normalize("NFD");
  const regexString = params.matchWholeWords
    ? `\\b${normalizedSearchTerm}\\b`
    : normalizedSearchTerm;
  const searchRegex = new RegExp(regexString, "i");
  console.log(searchRegex);
  return function testRegex(textToTest: string) {
    const normalizedTextToTest = textToTest.normalize("NFD");
    return searchRegex.test(normalizedTextToTest);
  };
}

export default async function search(params: HagovSearchParams): Promise<Result[]> {
  const textMatcher = buildRegex(params);
  const results: Result[] = [];
  const show = params.show || defaultParams.show;

  const videos: Video[] = videoList
    .filter((video) => video.show === show)
    .map((video) => ({
      ...video,
      subtitles: require(`./subtitles_json/${video.videoId}.json`),
    }));

  for (const video of videos) {
    const matches = video.subtitles.filter((subtitle, index) => {
      const subtitleText = subtitle[0];
      const subtitleMatches = textMatcher(subtitleText);
      if (subtitleMatches) return true;

      const nextSubtitleText = video.subtitles[index + 1]?.[0];
      if (!nextSubtitleText) return false;

      const nextSubtitleMatches = textMatcher(nextSubtitleText);
      if (nextSubtitleMatches) return false;

      const thisAndNextSubtitleMatches = textMatcher(`${subtitleText} ${nextSubtitleText}`);
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
