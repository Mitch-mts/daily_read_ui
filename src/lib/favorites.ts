import type { FavoriteVerse } from "@/types/bible";

const FAVORITES_KEY = "daily-reader-favorites";

export function loadFavorites(): FavoriteVerse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as FavoriteVerse[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteVerse[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}
