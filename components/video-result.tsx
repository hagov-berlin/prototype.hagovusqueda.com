import type { Result } from "@/data/types";
import styles from "./video-result.module.css";
import { SubtitleResult } from "./subtitle-result";

function parseDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

type ResultProps = {
  result: Result;
};

export default function VideoResult(props: ResultProps) {
  const { result } = props;
  return (
    <div className={styles.videoResult}>
      <div>
        <h3 className={styles.videoResultTitle}>{result.title || "Missing title"}</h3>{" "}
        <span>{result.date ? parseDate(result.date) : "Missing date"}</span>
      </div>
      {result.subtitles.map((subtitle, index) => (
        <SubtitleResult key={index} videoId={result.videoId} subtitle={subtitle} />
      ))}
    </div>
  );
}
