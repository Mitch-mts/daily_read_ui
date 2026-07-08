import type { Testament } from "@/types/bible";

export type NavSection =
  | "home"
  | "read"
  | "plans"
  | "favorites"
  | "notes"
  | "history"
  | "goals"
  | "settings";

export interface ReadingHistoryEntry {
  id: number;
  bookId: number;
  bookName: string;
  chapterId: number;
  verseId?: number;
  testamentFilter: Testament;
  openedAt: string;
}

export interface ReadingNote {
  id: number;
  book: string;
  chapter: number;
  verseId?: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  chaptersTotal: number;
}

export interface PlanProgress {
  planId: string;
  startedAt: string;
  daysCompleted: number;
}
