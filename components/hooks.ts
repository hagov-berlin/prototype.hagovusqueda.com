import { HagovSearchParams, isShow } from "@/data/types";
import { useSearchParams } from "next/navigation";

export function useHagovSearchParams(): Partial<HagovSearchParams> {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("q") || undefined;

  const showString = searchParams.get("show");
  const show = showString && isShow(showString) ? showString : undefined;

  const matchWholeWordsString = searchParams.get("matchWholeWords")?.toLowerCase();
  const matchWholeWords = matchWholeWordsString === "false" ? false : true;

  return { searchTerm, show, matchWholeWords };
}
