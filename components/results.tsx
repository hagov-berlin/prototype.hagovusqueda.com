import { Result } from "@/data/types";
import styles from "./results.module.css";

type ResultsProps = {
  searchTerm: string;
  loading: boolean;
  results: Result[];
};

export default function Results(props: ResultsProps) {
  const { searchTerm, loading, results } = props;

  if (!searchTerm) return null;

  const title = loading
    ? "Buscando..."
    : results.length === 0
    ? `No hay resultados para "${searchTerm}"`
    : results.length === 1
    ? `1 resultado para "${searchTerm}"`
    : `${results.length} resultados para "${searchTerm}"`;

  return (
    <div className={styles.results}>
      <h2 className={styles.title}>{title}</h2>
      {results.length > 0 && (
        <iframe
          className={styles.resultsIframe}
          width="640"
          height="360"
          src={`http://www.youtube.com/embed/${results[0].videoId}?start=${results[0].subtitles[0][1]}&enablejsapi=1&origin=http://example.com`}
          frameBorder="0"
        ></iframe>
      )}
      {results.map((result) => (
        <p key={result.videoId}>
          {result.videoId}: {result.subtitles.length}
        </p>
      ))}
    </div>
  );
}
