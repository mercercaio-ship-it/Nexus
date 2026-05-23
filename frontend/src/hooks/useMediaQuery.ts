// CreativEdge Phase 6-D - useMediaQuery hook.
//
// Returns the live `matches` value of a CSS media query. Used by
// ChatLayout to decide between the desktop 3-pane grid and the
// mobile single-pane + drawer chrome. SSR-safe (returns the initial
// `defaultValue` until the browser sets up a `MediaQueryList`).

import { useEffect, useState } from "react";

export function useMediaQuery(
  query: string,
  defaultValue = false
): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return defaultValue;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent): void => setMatches(e.matches);
    // Sync once (in case the query state changed between SSR and mount).
    setMatches(mql.matches);
    // Modern API; fall back to deprecated `addListener` only if needed.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Older Safari path.
    const legacy = mql as unknown as {
      addListener: (cb: (e: MediaQueryListEvent) => void) => void;
      removeListener: (cb: (e: MediaQueryListEvent) => void) => void;
    };
    legacy.addListener(onChange);
    return () => legacy.removeListener(onChange);
  }, [query]);

  return matches;
}
