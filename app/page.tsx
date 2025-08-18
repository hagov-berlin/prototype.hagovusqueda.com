"use client";

import { useEffect, useState, Suspense } from "react";

import { Result } from "@/data/types";
import search from "@/data/search";
import Form from "@/components/form";
import ResultsContainer from "@/components/results-container";
import FAQs from "@/components/faqs";
import { useHagovSearchParams } from "@/components/hooks";

import styles from "./page.module.css";

function Page() {
  const params = useHagovSearchParams();
  const { searchTerm, show, matchWholeWords } = params;
  const [loading, setLoading] = useState(!!searchTerm);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      setResults([]);
      search({ searchTerm, show, matchWholeWords }).then((newResults) => {
        setResults(newResults);
        setLoading(false);
      });
    }
  }, [searchTerm, show, matchWholeWords]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>HagoVusqueda</h1>
        <Form loading={loading} />
      </header>
      <main className={styles.main}>
        <ResultsContainer params={params} loading={loading} results={results} />
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
