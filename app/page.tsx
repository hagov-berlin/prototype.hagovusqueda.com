"use client";

import { Suspense } from "react";

import Form from "@/components/form";
import ResultsContainer from "@/components/results-container";
import FAQs from "@/components/faqs";
import { useSearch } from "@/components/hooks";

import styles from "./page.module.css";

function Page() {
  const { results, loading, resultsCapped } = useSearch();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          HAGOVusqueda
          <span className={styles.betaLabel}>BETA</span>
        </h1>
        <Form loading={loading} />
      </header>
      <main className={styles.main}>
        <ResultsContainer loading={loading} results={results} resultsCapped={resultsCapped} />
      </main>
      <footer className={styles.footer}>
        <FAQs />
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}
