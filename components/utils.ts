import { HagovSearchParams } from "@/data/types";

export const defaultParams: Omit<HagovSearchParams, "searchTerm"> = {
  show: "HAA",
  matchWholeWords: true,
  ignoreAccents: true,
};

export function urlWithQueryParams(newParams: HagovSearchParams) {
  const params = new URLSearchParams();
  params.set("q", newParams.searchTerm);
  if (newParams.show !== defaultParams.show) {
    params.set("show", newParams.show);
  }
  if (newParams.ignoreAccents !== defaultParams.ignoreAccents) {
    params.set("ia", newParams.ignoreAccents.toString());
  }
  if (newParams.matchWholeWords !== defaultParams.matchWholeWords) {
    params.set("w", newParams.matchWholeWords.toString());
  }
  return `${window.location.pathname}?${params.toString()}`;
}
