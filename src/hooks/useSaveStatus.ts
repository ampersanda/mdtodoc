"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved";

export function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const trigger = useCallback(() => {
    setStatus("saving");
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStatus("saved");
      timeoutRef.current = setTimeout(() => setStatus("idle"), 1500);
    }, 300);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return { status, trigger };
}
