const STORAGE_KEY = "daily-reader-journey";

export interface ReadingJourney {
  chaptersReadSession: number;
  chaptersReadWeek: number;
  streak: number;
  lastReadDate: string | null;
  weekStart: string;
}

function getWeekStart(): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return date.toISOString().split("T")[0];
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterday(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}

const DEFAULT_JOURNEY: ReadingJourney = {
  chaptersReadSession: 0,
  chaptersReadWeek: 0,
  streak: 0,
  lastReadDate: null,
  weekStart: getWeekStart(),
};

export function loadJourney(): ReadingJourney {
  if (typeof window === "undefined") return DEFAULT_JOURNEY;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_JOURNEY;

    const parsed = JSON.parse(raw) as ReadingJourney;
    const currentWeekStart = getWeekStart();

    if (parsed.weekStart !== currentWeekStart) {
      return {
        ...parsed,
        chaptersReadWeek: 0,
        weekStart: currentWeekStart,
      };
    }

    return parsed;
  } catch {
    return DEFAULT_JOURNEY;
  }
}

export function recordChapterRead(): ReadingJourney {
  const current = loadJourney();
  const today = getToday();
  const yesterday = getYesterday();

  let streak = current.streak;
  if (current.lastReadDate !== today) {
    streak = current.lastReadDate === yesterday ? current.streak + 1 : 1;
  }

  const updated: ReadingJourney = {
    chaptersReadSession: current.chaptersReadSession + 1,
    chaptersReadWeek: current.chaptersReadWeek + 1,
    streak,
    lastReadDate: today,
    weekStart: getWeekStart(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
