import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "reporeef:scale";
const DEFAULT_SCALE = "md";

const SCALE_VALUES = {
  sm: 0.9,
  md: 1,
  lg: 1.15,
};

function readScale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SCALE_VALUES[stored] !== undefined) return stored;
  } catch {
    // skip silently
  }
  return DEFAULT_SCALE;
}

function applyScale(scaleKey) {
  const factor = SCALE_VALUES[scaleKey] ?? 1;
  document.documentElement.style.setProperty("--scale-factor", String(factor));
}

export function useScale() {
  const [scale, setScaleState] = useState(DEFAULT_SCALE);

  useEffect(() => {
    const stored = readScale();
    setScaleState(stored);
    applyScale(stored);
  }, []);

  const setScale = useCallback((next) => {
    if (SCALE_VALUES[next] === undefined) return;
    setScaleState(next);
    applyScale(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // skip silently
    }
  }, []);

  const reset = useCallback(() => {
    setScaleState(DEFAULT_SCALE);
    applyScale(DEFAULT_SCALE);
    try {
      localStorage.setItem(STORAGE_KEY, DEFAULT_SCALE);
    } catch {
      // skip silently
    }
  }, []);

  return { scale, setScale, reset };
}
