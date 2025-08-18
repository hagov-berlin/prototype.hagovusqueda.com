"use server";

import { defaultParams } from "@/components/utils";
/* eslint-disable @typescript-eslint/no-require-imports */
import { Result, HagovSearchParams, VideoId, Subtitle } from "./types";
import { videoList } from "./video-list";

function normalizeText(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buildRegex(params: HagovSearchParams) {
  const normalizedSearchTerm = normalizeText(params.searchTerm);
  const regexString = params.matchWholeWords
    ? `\\b${normalizedSearchTerm}\\b`
    : normalizedSearchTerm;
  const searchRegex = new RegExp(regexString, "i");
  console.log(searchRegex);
  return function testRegex(textToTest: string) {
    const normalizedTextToTest = normalizeText(textToTest.normalize("NFD"));
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

export default async function search(params: HagovSearchParams): Promise<Result[]> {
  const textMatcher = buildRegex(params);
  const results: Result[] = [];
  const show = params.show || defaultParams.show;

  const resultsPromises = videoList
    .filter((video) => video.show === show)
    .map(async (video) => {
      try {
        const matches = await searchInVideo(video.videoId, textMatcher);
        if (matches.length) {
          results.push({
            ...video,
            subtitles: matches,
          });
        }
      } catch (error) {
        console.warn(error);
      }
    });

  await Promise.all(resultsPromises);

  return results;
}
