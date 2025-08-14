export type HagovSearchParams = {
  searchTerm: string;
  show?: string;
};

export function urlWithQueryParams(newParams: HagovSearchParams) {
  const params = new URLSearchParams();
  params.set("q", newParams.searchTerm);
  if (newParams.show && newParams.show !== "HAA") {
    params.set("show", newParams.show);
  }
  return `${window.location.pathname}?${params.toString()}`;
}
