"use client";

import { useMemo } from "react";

export function useGreeting(name = "Mitch") {
  return useMemo(() => {
    const hour = new Date().getHours();
    const period =
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return `${period}, ${name} 👋`;
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
