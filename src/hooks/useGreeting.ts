"use client";

import { useMemo } from "react";

export function useGreeting(name?: string | null) {
  return useMemo(() => {
    const hour = new Date().getHours();
    const period =
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const trimmed = name?.trim();
    return `${period}, ${trimmed || "Friend"} 👋`;
  }, [name]);
}

export function useDateLabel() {
  return useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );
}
