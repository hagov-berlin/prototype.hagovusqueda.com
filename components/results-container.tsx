import { HagovSearchParams, Result } from "@/data/types";
import VideoResult from "./video-result";
import styles from "./results-container.module.css";

function countSubtitles(results: Result[]) {
  const count = results.reduce((accum, result) => accum + result.subtitles.length, 0);
  return `${count} ${count === 1 ? "resultado" : "resultados"}`;
}

function countResults(results: Result[]) {
  return `${results.length} ${results.length === 1 ? "video" : "videos"}`;
}

type ResultsContainerProps = {
  params: Partial<HagovSearchParams>;
  loading: boolean;
  results: Result[];
};

export default function ResultsContainer(props: ResultsContainerProps) {
  const {
    loading,
    results,
    params: { searchTerm },
  } = props;

  if (!searchTerm) return null;

  const title = loading
    ? "Buscando..."
    : results.length === 0
    ? `No hay resultados para "${searchTerm}"`
    : `${countSubtitles(results)} en ${countResults(results)} para "${searchTerm}"`;

  return (
    <div className={styles.results}>
      <h2 className={styles.title}>{title}</h2>
      {results.map((result) => (
        <VideoResult key={result.videoId} result={result} />
      ))}
    </div>
  );
}
