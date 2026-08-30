import { useEffect, useState } from "react";

export interface Route {
  page: string;
  param?: string;
  query: URLSearchParams;
}

export function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  const segs = path.split("/").filter(Boolean);
  return {
    page: segs[0] || "home",
    param: segs[1] ? decodeURIComponent(segs[1]) : undefined,
    query: new URLSearchParams(qs ?? ""),
  };
}

export function go(path: string) {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
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
