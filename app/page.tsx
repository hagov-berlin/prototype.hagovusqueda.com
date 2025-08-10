"use client";

import { FormEvent, useRef, useState } from "react";
import { Result } from "@/data/types";
import search from "@/data/search";
import styles from "./page.module.css";

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
      <header className={styles.header}>
        <h1 className={styles.title}>HagoVusqueda</h1>
        <form className={styles.form} onSubmit={onSubmit}>
          <h2 className={styles.subtitle}>Buscar en el Archivo Hagovero</h2>
          <input type="text" ref={inputRef} className={styles.input} />
        </form>
      </header>
      <main className={styles.main}>
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
