export type Testament = "OT" | "NT";

export interface Book {
  id: number;
  book: string;
  verses: number;
  chapters: number;
  testament: Testament;
}

export interface BibleBookRef {
  name: string;
  testament: Testament;
}

export interface BibleVerse {
  chapterId: number;
  verseId: number;
  verse: string;
  book: BibleBookRef;
}

export interface ChapterResponse {
  result: BibleVerse[];
}

export interface BooksResponse {
  books: Book[];
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export type ReadingMode = "normal" | "large" | "extra-large";

export type ReadingTheme = "light" | "sepia" | "dark";

export interface ParsedVerse {
  verseId: number;
  verse: string;
}

export interface FavoriteVerse {
  id: number;
  verse: string[];
  book: string;
  chapter: number;
  /** Present when a single verse was saved rather than a whole chapter. */
  verseId?: number;
  date: string;
}

/** External provider shape from bible-api.com */
export interface ExternalBibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface ExternalBibleChapterResponse {
  reference: string;
  verses: ExternalBibleVerse[];
  translation_id: string;
  translation_name: string;
}
