import { Result } from "@/data/types";
import VideoResult from "./video-result";
import styles from "./results-container.module.css";
import { useHagovSearchParams } from "./hooks";

function countSubtitles(results: Result[]) {
  const count = results.reduce((accum, result) => accum + result.subtitles.length, 0);
  return `${count} ${count === 1 ? "resultado" : "resultados"}`;
}

function countResults(results: Result[]) {
  return `${results.length} ${results.length === 1 ? "video" : "videos"}`;
}

type ResultsContainerProps = {
  loading: boolean;
  results: Result[];
  resultsCapped: boolean;
};

export default function ResultsContainer(props: ResultsContainerProps) {
  const { loading, results, resultsCapped } = props;

  const { searchTerm } = useHagovSearchParams();

  if (!searchTerm) return null;

  const title = loading
    ? "Buscando..."
    : results.length === 0
    ? `No hay resultados para "${searchTerm}"`
    : `${resultsCapped ? "Mas de " : ""}${countSubtitles(results)} en ${countResults(
        results
      )} para "${searchTerm}"`;

  return (
    <div className={styles.results}>
      <h2 className={styles.title}>{title}</h2>
      {results?.map((result) => (
        <VideoResult key={result.videoId} result={result} />
      ))}
    </div>
  );
}
