import type { ReadingNote } from "@/types/dashboard";

const NOTES_KEY = "daily-reader-notes";

export function loadNotes(): ReadingNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? (JSON.parse(raw) as ReadingNote[]) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: ReadingNote[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function addNote(
  book: string,
  chapter: number,
  text: string,
  verseId?: number,
): ReadingNote[] {
  const now = new Date().toISOString();
  const note: ReadingNote = {
    id: Date.now(),
    book,
    chapter,
    verseId,
    text: text.trim(),
    createdAt: now,
    updatedAt: now,
  };
  const next = [note, ...loadNotes()];
  saveNotes(next);
  return next;
}

export function updateNote(id: number, text: string): ReadingNote[] {
  const next = loadNotes().map((note) =>
    note.id === id
      ? { ...note, text: text.trim(), updatedAt: new Date().toISOString() }
      : note,
  );
  saveNotes(next);
  return next;
}

export function removeNote(id: number): ReadingNote[] {
  const next = loadNotes().filter((note) => note.id !== id);
  saveNotes(next);
  return next;
}

export function formatNoteReference(note: ReadingNote): string {
  return note.verseId !== undefined
    ? `${note.book} ${note.chapter}:${note.verseId}`
    : `${note.book} ${note.chapter}`;
}
