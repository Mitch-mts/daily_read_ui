"use client";

import { useCallback, useEffect, useState } from "react";

const NAME_KEY = "daily-reader-name";

export function useUserName() {
  const [name, setName] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NAME_KEY);
      setName(stored && stored.trim() ? stored : null);
    } catch {
      setName(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  const saveName = useCallback((next: string) => {
    const trimmed = next.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(NAME_KEY, trimmed);
    } catch {
      // ignore storage failures; keep name in memory
    }
    setName(trimmed);
  }, []);

  const clearName = useCallback(() => {
    try {
      localStorage.removeItem(NAME_KEY);
    } catch {
      // ignore
    }
    setName(null);
  }, []);

  return {
    name,
    isReady,
    needsName: isReady && !name,
    saveName,
    clearName,
  };
}
