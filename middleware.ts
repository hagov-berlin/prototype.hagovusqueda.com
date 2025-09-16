import { NextResponse, NextRequest } from "next/server";
import { AVAILABLE_SHOWS_OLD } from "./data/shows";

export function middleware(request: NextRequest) {
  const url = request.url;

  let hasValidParams = true;
  let urlSearchParams: URLSearchParams | undefined = undefined;
  if (url.includes("?")) {
    const [, searchParamsString] = url.split("?");
    urlSearchParams = new URLSearchParams(searchParamsString);
    const show = urlSearchParams.get("show");
    if (show && show in AVAILABLE_SHOWS_OLD) {
      hasValidParams = false;
      const showKey = show as keyof typeof AVAILABLE_SHOWS_OLD;
      urlSearchParams.set("show", AVAILABLE_SHOWS_OLD[showKey]);
    }
  }
  if (hasValidParams || !urlSearchParams) {
    return NextResponse.next();
  }

  const newUrl = new URL(`/?${urlSearchParams.toString()}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: "/",
};
