import type { ReadingHistoryEntry } from "@/types/dashboard";
import type { Testament } from "@/types/bible";

const HISTORY_KEY = "daily-reader-history";
const MAX_ENTRIES = 25;

export function loadHistory(): ReadingHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ReadingHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: ReadingHistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function addHistoryEntry(
  entry: Omit<ReadingHistoryEntry, "id" | "openedAt">,
): ReadingHistoryEntry[] {
  const openedAt = new Date().toISOString();
  const nextEntry: ReadingHistoryEntry = {
    ...entry,
    id: Date.now(),
    openedAt,
  };

  const existing = loadHistory().filter(
    (item) =>
      !(
        item.bookId === entry.bookId &&
        item.chapterId === entry.chapterId &&
        (item.verseId ?? null) === (entry.verseId ?? null)
      ),
  );

  const next = [nextEntry, ...existing].slice(0, MAX_ENTRIES);
  saveHistory(next);
  return next;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function formatHistoryReference(entry: ReadingHistoryEntry): string {
  return entry.verseId !== undefined
    ? `${entry.bookName} ${entry.chapterId}:${entry.verseId}`
    : `${entry.bookName} ${entry.chapterId}`;
}

export function formatHistoryTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export type { Testament };
