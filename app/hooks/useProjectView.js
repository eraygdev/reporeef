import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "projectView";
const DEFAULT_VIEW = "normal";

function readView() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "normal" || stored === "compact") return stored;
  } catch {
    // skip silently
  }
  return DEFAULT_VIEW;
}

export function useProjectView() {
  const [view, setViewState] = useState(DEFAULT_VIEW);

  useEffect(() => {
    setViewState(readView());
  }, []);

  const setView = useCallback((newView) => {
    if (newView !== "normal" && newView !== "compact") return;
    setViewState(newView);
    try {
      localStorage.setItem(STORAGE_KEY, newView);
    } catch {
      // skip silently
    }
  }, []);

  return {
    view,
    isCompact: view === "compact",
    setView,
  };
}
