"use server";

import { Result, Subtitle, VideoId } from "./types";
import videos from "./videos.json";
import { promises as fs } from "fs";

async function loadSubtitles() {
  const subtitles: Record<VideoId, Subtitle[]> = {};
  await Promise.all(
    videos.map(async (video) => {
      const file = await fs.readFile(process.cwd() + `/data/subtitles_json/${video.id}.json`);
      subtitles[video.id] = JSON.parse(file.toString());
    })
  );
  return subtitles;
}

export default async function search(searchTerm: string): Promise<Result[]> {
  const subtitles = await loadSubtitles();
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
