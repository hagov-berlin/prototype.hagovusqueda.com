import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import util from "node:util";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const CONFIG = {
  videoJsonFilepath: path.join(__dirname, "videos.json"),
  jsonFolderOutputPath: path.join(__dirname, "subtitles_json"),
  rawFolderOutputPath: path.join(__dirname, "subtitles_raw"),
} as const;

type Video = {
  id: string;
};

const execPromise = util.promisify(exec);

function readVideosJson() {
  const videosFileContent = fs.readFileSync(CONFIG.videoJsonFilepath).toString();
  const videos: Video[] = JSON.parse(videosFileContent);
  return videos;
}

function timeToSeconds(rawTimeString: string) {
  const [timeString] = rawTimeString.split(",");
  const [hoursString, minutesString, secondsString] = timeString.split(":");
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);
  const seconds = parseInt(secondsString, 10);
  return seconds + minutes * 60 + hours * 60 * 60;
}

function convertSrtToJSON(video: Video, subtitleContent: string) {
  console.log(`Converting raw subtitle to JSON for video ${video.id}`);
  const data = subtitleContent.split("\n").filter((line) => line);
  const obj: object[] = [];
  for (let n = 0; n < data.length; n += 3) {
    const [startTime, endTime] = data[n + 1].split(" --> ");
    const text = data[n + 2];
    obj.push([text, timeToSeconds(startTime), timeToSeconds(endTime)]);
  }
  if (!fs.existsSync(CONFIG.jsonFolderOutputPath)) {
    fs.mkdirSync(CONFIG.jsonFolderOutputPath);
  }
  const outputPath = path.join(CONFIG.jsonFolderOutputPath, `${video.id}.json`);
  const stringifiedObj = JSON.stringify(obj);
  fs.writeFileSync(outputPath, stringifiedObj);
}

async function getSubtitlesForVideo(video: Video) {
  const outputPath = path.join(CONFIG.rawFolderOutputPath, video.id);
  const outputPathWithExtension = `${outputPath}.es.srt`;

  if (fs.existsSync(outputPathWithExtension)) {
    console.log(`Skipping download of subtitles for ${video.id}. Already downloaded`);
  } else {
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const command = `yt-dlp "${videoUrl}" --skip-download --write-auto-sub --sub-lang "es" --sub-format srt --output "${outputPath}"`;
    console.log(`Downloading subtitles for ${video.id}`);
    await execPromise(command);
  }

  return fs.readFileSync(outputPathWithExtension).toString();
}

(async function main() {
  const videos = readVideosJson();

  for (const video of videos) {
    let subtitleContent = "";
    try {
      subtitleContent = await getSubtitlesForVideo(video);
    } catch (error) {
      console.error(`Failed to get subtitles for ${video.id}`);
      console.error(error);
      continue;
    }
    convertSrtToJSON(video, subtitleContent);
  }
})();
