"use client";

import { useEffect, useState } from "react";

function formatGreeting(name?: string | null) {
  const hour = new Date().getHours();
  const period =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const trimmed = name?.trim();
  return `${period}, ${trimmed || "Friend"} 👋`;
}

function formatDateLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Time-based strings are computed after mount so SSR HTML matches
 * the first client render (avoids hydration mismatches).
 */
export function useGreeting(name?: string | null) {
  const [greeting, setGreeting] = useState("Welcome, Friend 👋");

  useEffect(() => {
    setGreeting(formatGreeting(name));
  }, [name]);

  return greeting;
}

export function useDateLabel() {
  const [dateLabel, setDateLabel] = useState("Today");

  useEffect(() => {
    setDateLabel(formatDateLabel());
  }, []);

  return dateLabel;
}
