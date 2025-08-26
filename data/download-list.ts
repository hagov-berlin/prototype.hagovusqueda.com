import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

import fs from "fs";
import stringify from "json-stringify-pretty-compact";
import { Video, VideoId } from "./types";

const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const channelId = "UC6pJGaMdx5Ter_8zYbLoRgA"; // Blender Channel ID
const blenderPlaylist = channelId.replace(/^UC/, "UU");
const magaPlaylist = "PLSaospqN2Pt95vDDK3S2DflxXbkcC4EcI";
const listOutputPath = path.join(__dirname, "videos", "list.json");
const ignoredOutputPath = path.join(__dirname, "videos", "ignored.json");
const pendingOutputPath = path.join(__dirname, "videos", "pending.json");

type PlaylistItem = {
  snippet: {
    title: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
  };
};

type VideoDetail = {
  contentDetails: { duration: string };
  liveStreamingDetails?: {
    actualStartTime?: string;
  };
};

async function request(
  playlist: string,
  pageToken?: string
): Promise<{ videos: Video[]; nextPageToken: string }> {
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlist}&key=${youtubeApiKey}`;
  if (pageToken) {
    url = `${url}&pageToken=${pageToken}`;
  }
  const response = await fetch(url);
  const { items, nextPageToken } = await response.json();

  const ids = items.map((item: PlaylistItem) => item.snippet.resourceId.videoId).join(",");
  const detailUrl = `https://www.googleapis.com/youtube/v3/videos?key=${youtubeApiKey}&id=${ids}&part=contentDetails,liveStreamingDetails`;
  const detailResponse = await fetch(detailUrl);
  const detailJson: { items: VideoDetail[] } = await detailResponse.json();

  return {
    nextPageToken,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    videos: items.map((item: PlaylistItem, index: number) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      date:
        detailJson.items[index].liveStreamingDetails?.actualStartTime || item.snippet.publishedAt,
      duration: detailJson.items[index].contentDetails.duration,
    })),
  };
}

type AllVideos = {
  list: Record<VideoId, Video>;
  ignored: Record<VideoId, Video>;
  pending: Record<VideoId, Video>;
};

function loadExistingVideos(): AllVideos {
  const listMap: Record<VideoId, Video> = {};
  const videoList: Video[] = JSON.parse(fs.readFileSync(listOutputPath).toString());
  videoList.forEach((video) => {
    if (listMap[video.videoId]) {
      console.warn(`Duplicated video: ${video.videoId}`);
    }
    listMap[video.videoId] = video;
  });
  const ignoredMap: Record<VideoId, Video> = {};
  const ignoredList: Video[] = JSON.parse(fs.readFileSync(ignoredOutputPath).toString());
  ignoredList.forEach((video) => {
    if (listMap[video.videoId] || ignoredMap[video.videoId]) {
      console.warn(`Duplicated video: ${video.videoId}`);
    }
    ignoredMap[video.videoId] = video;
  });
  return { list: listMap, ignored: ignoredMap, pending: {} };
}

function saveVideos(path: string, videos: Video[]) {
  videos.sort((a, b) => a.date.localeCompare(b.date));
  fs.writeFileSync(path, stringify(videos));
}

function mergeVideos(allVideos: AllVideos, newVideos: Video[]) {
  newVideos.forEach((video) => {
    if (allVideos.list[video.videoId]) {
      allVideos.list[video.videoId] = {
        ...allVideos.list[video.videoId],
        ...video,
      };
    } else if (allVideos.ignored[video.videoId]) {
      allVideos.ignored[video.videoId] = {
        ...allVideos.ignored[video.videoId],
        ...video,
      };
    } else if (/pt\d+s/i.test(video.duration)) {
      allVideos.ignored[video.videoId] = video;
    } else {
      allVideos.pending[video.videoId] = video;
    }
  });
}

async function processPlaylist(playlistId: string, allVideos: AllVideos) {
  let count = 1;
  console.log(`Requesting initial page ${count} for playlist ${playlistId}`);
  const { videos: newVideos, nextPageToken } = await request(playlistId);
  mergeVideos(allVideos, newVideos);
  let pageToken = nextPageToken;
  while (pageToken) {
    count += 1;
    console.log(`Requesting initial page ${count} ${pageToken}`);
    const { videos: newVideos, nextPageToken } = await request(playlistId, pageToken);
    mergeVideos(allVideos, newVideos);
    pageToken = nextPageToken;
  }
}

(async function () {
  const allVideos = loadExistingVideos();
  await processPlaylist(blenderPlaylist, allVideos);
  await processPlaylist(magaPlaylist, allVideos);
  saveVideos(listOutputPath, Object.values(allVideos.list));
  saveVideos(ignoredOutputPath, Object.values(allVideos.ignored));
  saveVideos(pendingOutputPath, Object.values(allVideos.pending));
})();
