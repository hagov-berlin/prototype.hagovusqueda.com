"use server";

import { defaultParams } from "@/components/utils";
/* eslint-disable @typescript-eslint/no-require-imports */
import { Result, HagovSearchParams, VideoId, Subtitle, SearchResult } from "./types";
import { videoList } from "./video-list";

function normalizeText(text: string, ignoreAccents: boolean) {
  if (ignoreAccents) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return text;
}

function buildRegex(params: HagovSearchParams) {
  const normalizedSearchTerm = normalizeText(params.searchTerm, params.ignoreAccents);
  const regexString = params.matchWholeWords
    ? `\\b${normalizedSearchTerm}\\b`
    : normalizedSearchTerm;
  const searchRegex = new RegExp(regexString, "i");
  return function testRegex(textToTest: string) {
    const normalizedTextToTest = normalizeText(textToTest, params.ignoreAccents);
    return searchRegex.test(normalizedTextToTest);
  };
}

async function searchInVideo(videoId: VideoId, textMatcher: (text: string) => boolean) {
  const subtitles: Subtitle[] = require(`./subtitles_json/${videoId}.json`);
  const matches = subtitles.filter((subtitle, index) => {
    const subtitleText = subtitle[0];
    const subtitleMatches = textMatcher(subtitleText);
    if (subtitleMatches) return true;

    const nextSubtitleText = subtitles[index + 1]?.[0];
    if (!nextSubtitleText) return false;

    const nextSubtitleMatches = textMatcher(nextSubtitleText);
    if (nextSubtitleMatches) return false;

    const thisAndNextSubtitleMatches = textMatcher(`${subtitleText} ${nextSubtitleText}`);
    return thisAndNextSubtitleMatches;
  });
  return matches;
}

export default async function search(params: HagovSearchParams): Promise<SearchResult> {
  const textMatcher = buildRegex(params);
  const results: Result[] = [];
  const show = params.show || defaultParams.show;

  const maxResultCount = 200;
  let resultsCapped = false;
  let count = 0;

  const resultsPromises = videoList
    .filter((video) => video.show === show)
    .map(async (video) => {
      let matches: Subtitle[] | null = null;
      try {
        matches = await searchInVideo(video.videoId, textMatcher);
      } catch (error) {
        console.warn(error);
      }

      if (count <= maxResultCount && matches && matches.length) {
        if (count + matches.length <= maxResultCount) {
          results.push({
            ...video,
            subtitles: matches,
          });
          count += matches.length;
        } else if (count < maxResultCount) {
          results.push({
            ...video,
            subtitles: matches.slice(0, maxResultCount - count),
          });
          count = maxResultCount;
          resultsCapped = true;
        }
      }
    });

  await Promise.all(resultsPromises);

  return { results, resultsCapped };
}
