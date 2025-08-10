"use client";

import { useState } from "react";
import { Result } from "@/data/types";
import search from "@/data/search";
import styles from "./page.module.css";
import Form from "@/components/form";

export default function Home() {
  const [results, setResults] = useState<Result[]>([]);

  const onSubmit = async (searchTerm: string) => {
    const newResults = await search(searchTerm);
    console.log(newResults[0]);
    setResults(newResults);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>HagoVusqueda</h1>
        <Form onSubmit={onSubmit} />
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
      </main>
    </div>
  );
}
