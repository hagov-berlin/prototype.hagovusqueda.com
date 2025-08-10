"use client";

import { FormEvent, useRef, useState } from "react";
import styles from "./page.module.css";
import { Result } from "@/data/types";
import search from "@/data/search";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<Result[]>([]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputRef.current) return;
    const newResults = await search(inputRef.current.value);
    console.log(newResults[0]);
    setResults(newResults);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Archivo Hagovero</h1>
        <form onSubmit={onSubmit}>
          <p>
            <label>Buscar en el Archivo Hagovero</label>
          </p>
          <input type="text" ref={inputRef} />
        </form>
        <div>
          <h2>
            {results.length
              ? `${results.length} ${results.length > 1 ? "resultados" : "resultado"}`
              : "No hay resultados"}
          </h2>
          {results.length > 0 && (
            <iframe
              id="player"
              width="640"
              height="390"
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
      </main>
    </div>
  );
}
