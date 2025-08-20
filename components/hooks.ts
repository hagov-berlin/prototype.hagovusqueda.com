import { useEffect, useState } from "react";
import { HagovSearchParams, isShow, Result } from "@/data/types";
import { useSearchParams } from "next/navigation";
import { defaultParams } from "./utils";
import search from "@/data/search";

function parseBoolean(booleanString: string, defaultValue: boolean): boolean {
  if (["true", "false"].includes(booleanString)) {
    return JSON.parse(booleanString);
  }
  return defaultValue;
}

export function useHagovSearchParams(): HagovSearchParams {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("q") || "";

  const showString = searchParams.get("show");
  const show = showString && isShow(showString) ? showString : defaultParams.show;

  const matchWholeWordsString = searchParams.get("w")?.toLowerCase() || "";
  const matchWholeWords = parseBoolean(matchWholeWordsString, defaultParams.matchWholeWords);

  const ignoreAccentsString = searchParams.get("ia")?.toLowerCase() || "";
  const ignoreAccents = parseBoolean(ignoreAccentsString, defaultParams.ignoreAccents);
  return { searchTerm, show, matchWholeWords, ignoreAccents };
}

export function useSearch() {
  const params = useHagovSearchParams();
  const { searchTerm, show, matchWholeWords, ignoreAccents } = params;
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(!!searchTerm);
  const [resultsCapped, setResultsCapped] = useState(!!searchTerm);

  useEffect(() => {
    if (searchTerm?.length > 0) {
      setResults([]);
      setResultsCapped(false);
      setLoading(true);
      search({ searchTerm, show, matchWholeWords, ignoreAccents }).then((searchResults) => {
        setResults(searchResults.results);
        setResultsCapped(searchResults.resultsCapped);
        setLoading(false);
      });
    }
  }, [searchTerm, show, matchWholeWords, ignoreAccents]);

  return { results, loading, resultsCapped };
}
