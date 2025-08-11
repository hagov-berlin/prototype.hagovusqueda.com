"use client";

import { useState } from "react";
import { Result } from "@/data/types";
import search from "@/data/search";
import styles from "./page.module.css";
import Form from "@/components/form";
import ResultsContainer from "@/components/results-container";
import FAQs from "@/components/faqs";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const onSubmit = async (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setLoading(true);
    setResults([]);
    const newResults = await search(searchTerm);
    setResults(newResults);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>HagoVusqueda</h1>
        <Form onSubmit={onSubmit} loading={loading} />
      </header>
      <main className={styles.main}>
        <ResultsContainer searchTerm={searchTerm} loading={loading} results={results} />
      </main>
      <footer className={styles.footer}>
        <FAQs />
      </footer>
    </div>
  );
}
