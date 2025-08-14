import { useSearchParams } from "next/navigation";
import { HagovSearchParams } from "./utils";

export function useHagovSearchParams(): Partial<HagovSearchParams> {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("q") || undefined;
  const show = searchParams.get("show") || undefined;

  return { searchTerm, show };
}
