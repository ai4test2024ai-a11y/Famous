import { useEffect, useState } from "react";

export interface Route {
  page: string;
  query: URLSearchParams;
}

export function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  return { page: path || "home", query: new URLSearchParams(qs ?? "") };
}

export function go(path: string) {
  window.location.hash = path;
  window.scrollTo(0, 0);
}

export function useRoute(): Route {
  const [r, setR] = useState<Route>(parseHash);
  useEffect(() => {
    const f = () => setR(parseHash());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return r;
}
