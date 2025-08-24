import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "node:util";
import stringify from "json-stringify-pretty-compact";
import videosWithoutSubtitles from "./videos/missing-subtitles";
import { timeToSeconds } from "./utils";
import { Video } from "./types";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const videoList: Video[] = require("./videos/list.json");

const CONFIG = {
  jsonFolderOutputPath: path.join(__dirname, "subtitles_json"),
  rawFolderOutputPath: path.join(__dirname, "subtitles_raw"),
} as const;

const execPromise = util.promisify(exec);

function convertSrtToJSON(videoId: string, subtitleContent: string) {
  console.log(`Converting raw subtitle to JSON for video ${videoId}`);
  const data = subtitleContent.split("\n").filter((line) => line);
  const obj: object[] = [];
  for (let n = 0; n < data.length; n += 3) {
    const [startTime, endTime] = data[n + 1].split(" --> ");
    const text = data[n + 2];
    obj.push([text, timeToSeconds(startTime, videoId), timeToSeconds(endTime, videoId)]);
  }
  if (!fs.existsSync(CONFIG.jsonFolderOutputPath)) {
    fs.mkdirSync(CONFIG.jsonFolderOutputPath);
  }
  const outputPath = path.join(CONFIG.jsonFolderOutputPath, `${videoId}.json`);
  const stringifiedObj = stringify(obj);
  fs.writeFileSync(outputPath, stringifiedObj);
}

async function getSubtitlesForVideo(videoId: string) {
  const outputPath = path.join(CONFIG.rawFolderOutputPath, videoId);
  const outputPathWithExtension = `${outputPath}.es.srt`;

  if (fs.existsSync(outputPathWithExtension)) {
    console.log(`Skipping download of subtitles for ${videoId}. Already downloaded`);
  } else {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const command = `yt-dlp "${videoUrl}" --skip-download --write-auto-sub --sub-lang "es" --sub-format srt --cookies-from-browser firefox --output "${outputPath}"`;
    console.log(`Downloading subtitles for ${videoId}`);
    const { stdout, stderr } = await execPromise(command);
    console.log(stdout);
    console.error(stderr);
  }

  return fs.readFileSync(outputPathWithExtension).toString();
}

(async function main() {
  const errors: typeof videoList = [];
  for (const video of videoList) {
    if (videosWithoutSubtitles.includes(video.videoId)) continue;

    let subtitleContent = "";
    try {
      subtitleContent = await getSubtitlesForVideo(video.videoId);
    } catch (error) {
      console.error(`Failed to get subtitles for ${video.show}: ${video.videoId}`);
      console.error(error);
      errors.push(video);
      continue;
    }
    try {
      convertSrtToJSON(video.videoId, subtitleContent);
    } catch (error) {
      console.error(`Failed to get convert subtitles for ${video.show}: ${video.videoId}`);
      console.error(error);
      errors.push(video);
      continue;
    }
  }
  if (errors.length) {
    console.error(`ERRORS: ${errors.length}`);
    errors.forEach((video) => console.log(video.videoId));
  } else {
    console.log("No errors");
  }
})();
