"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  type StyleConfig,
  type StyleTarget,
  type TextStyle,
  DEFAULT_STYLES,
} from "@/lib/styles";

const STORAGE_KEY = "mdtodoc-styles";

export function useStyleConfig(onSave?: () => void) {
  const [styles, setStyles] = useState<StyleConfig>(DEFAULT_STYLES);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStyles({ ...DEFAULT_STYLES, ...JSON.parse(saved) });
      } catch {}
    }
    initialLoadRef.current = false;
  }, []);

  useEffect(() => {
    if (initialLoadRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(styles));
    onSave?.();
  }, [styles, onSave]);

  const updateStyle = useCallback(
    (target: StyleTarget, property: keyof TextStyle, value: string) => {
      setStyles((prev) => ({
        ...prev,
        [target]: {
          ...prev[target],
          [property]: value,
        },
      }));
    },
    []
  );

  const resetStyles = useCallback(() => {
    setStyles(DEFAULT_STYLES);
  }, []);

  return { styles, updateStyle, resetStyles };
}
