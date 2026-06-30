"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "@/constants/books";
import { useBibleChapter } from "@/hooks/useBibleChapter";
import { loadJourney, recordChapterRead } from "@/lib/readingJourney";
import type {
  FavoriteVerse,
  ParsedVerse,
  ReadingMode,
  ReadingTheme,
  Testament,
} from "@/types/bible";

type ToastVariant = "success" | "error" | "info";

interface ToastState {
  title: string;
  message: string;
  variant: ToastVariant;
}

type ModalMode = "favorites" | "info";

interface ModalState {
  title: string;
  message: string;
  variant: ToastVariant;
  mode: ModalMode;
}

const FAVORITES_KEY = "daily-reader-favorites";

const READING_MODE_LABEL: Record<ReadingMode, string> = {
  normal: "Normal",
  large: "Large",
  "extra-large": "Extra Large",
};

const READING_THEME_LABEL: Record<ReadingTheme, string> = {
  light: "Light",
  sepia: "Sepia",
  dark: "Dark",
};

const READING_MODE_CYCLE: ReadingMode[] = ["normal", "large", "extra-large"];
const READING_THEME_CYCLE: ReadingTheme[] = ["light", "sepia", "dark"];

function readingFontSize(mode: ReadingMode): string {
  if (mode === "large") return "text-xl md:text-2xl";
  if (mode === "extra-large") return "text-2xl md:text-3xl";
  return "text-lg md:text-xl";
}

function readingPanelClass(theme: ReadingTheme): string {
  if (theme === "sepia") return "reading-panel-sepia";
  if (theme === "dark") return "reading-panel-dark";
  return "reading-panel-light";
}

function loadFavorites(): FavoriteVerse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as FavoriteVerse[]) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteVerse[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function ReadingSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4" aria-hidden>
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className="reading-skeleton-line"
          style={{ width: `${65 + (index % 4) * 8}%` }}
        />
      ))}
    </div>
  );
}

function VerseText({
  verses,
  fontSizeClass,
}: {
  verses: ParsedVerse[];
  fontSizeClass: string;
}) {
  return (
    <article className={`mx-auto max-w-2xl font-serif ${fontSizeClass}`}>
      {verses.map((entry) => (
        <p key={entry.verseId} className="verse-line">
          <sup className="verse-num">{entry.verseId}</sup>
          <span>{entry.verse}</span>
        </p>
      ))}
    </article>
  );
}

export function DailyReader() {
  const { fetchChapter, isLoading } = useBibleChapter();
  const readingPanelRef = useRef<HTMLElement>(null);

  const [testamentFilter, setTestamentFilter] = useState<Testament | "">("");
  const [bookName, setBookName] = useState("Select Book");
  const [bookId, setBookId] = useState<number | "">("");
  const [chapterId, setChapterId] = useState<number | "">("");
  const [verses, setVerses] = useState<ParsedVerse[] | null>(null);
  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);
  const [expandedFavoriteId, setExpandedFavoriteId] = useState<number | null>(
    null,
  );
  const [journey, setJourney] = useState(loadJourney);
  const [showInspiration, setShowInspiration] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingMode>("normal");
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>("light");
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  const currentBook = useMemo(
    () => BOOKS.find((entry) => entry.id === bookId),
    [bookId],
  );

  const bookList = useMemo(() => {
    if (!testamentFilter) return [];
    return BOOKS.filter((book) => book.testament === testamentFilter).map(
      (book) => book.book,
    );
  }, [testamentFilter]);

  const chapterNumbers = useMemo(() => {
    if (!currentBook) return [];
    return Array.from(
      { length: currentBook.chapters },
      (_, index) => index + 1,
    );
  }, [currentBook]);

  const canGoPrev = chapterId !== "" && chapterId > 1;
  const canGoNext =
    chapterId !== "" && currentBook !== undefined && chapterId < currentBook.chapters;

  const isReading = verses !== null || isLoading;

  useEffect(() => {
    setFavoriteVerses(loadFavorites());
    setJourney(loadJourney());
  }, []);

  const showToast = useCallback((next: ToastState) => {
    setToast(next);
    window.setTimeout(() => setToast(null), next.variant === "error" ? 4000 : 2500);
  }, []);

  const applyChapterResponse = useCallback(
    (
      data: Awaited<ReturnType<typeof fetchChapter>>,
      selectedChapterId: number,
    ) => {
      const parsed = data.result.map((entry) => ({
        verseId: entry.verseId,
        verse: entry.verse,
      }));
      setVerses(parsed);
      setChapterId(selectedChapterId);
      setJourney(recordChapterRead());
      setLiveMessage(
        `Loaded ${bookName} chapter ${selectedChapterId}, ${parsed.length} verses.`,
      );
    },
    [bookName],
  );

  const loadChapter = useCallback(
    async (
      selectedBookId: number,
      selectedChapterId: number,
      selectedBookName: string,
    ) => {
      setVerses(null);
      setLiveMessage(`Loading ${selectedBookName} chapter ${selectedChapterId}…`);

      try {
        const data = await fetchChapter(selectedBookId, selectedChapterId);
        applyChapterResponse(data, selectedChapterId);
        readingPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Service temporarily unavailable";
        setLiveMessage(message);
        showToast({ title: "Error", message, variant: "error" });
      }
    },
    [applyChapterResponse, fetchChapter, showToast],
  );

  const handleOpenReading = () => {
    if (bookId === "" || chapterId === "") {
      showToast({
        title: "Selection required",
        message: "Please choose a testament, book, and chapter.",
        variant: "info",
      });
      return;
    }
    void loadChapter(bookId, chapterId, bookName);
  };

  const handleChapterSelect = (number: number) => {
    setChapterId(number);
    if (bookId !== "") {
      void loadChapter(bookId, number, bookName);
    }
  };

  const handlePrevChapter = useCallback(() => {
    if (bookId === "" || !canGoPrev || typeof chapterId !== "number") return;
    void loadChapter(bookId, chapterId - 1, bookName);
  }, [bookId, bookName, canGoPrev, chapterId, loadChapter]);

  const handleNextChapter = useCallback(() => {
    if (bookId === "" || !canGoNext || typeof chapterId !== "number") return;
    void loadChapter(bookId, chapterId + 1, bookName);
  }, [bookId, bookName, canGoNext, chapterId, loadChapter]);

  const handleRandomVerse = () => {
    const randomBook = BOOKS[Math.floor(Math.random() * BOOKS.length)];
    const randomChapter =
      Math.floor(Math.random() * randomBook.chapters) + 1;

    setBookName(randomBook.book);
    setBookId(randomBook.id);
    setChapterId(randomChapter);
    setTestamentFilter(randomBook.testament);

    showToast({
      title: "Random selection",
      message: `${randomBook.book} Chapter ${randomChapter}`,
      variant: "info",
    });

    void loadChapter(randomBook.id, randomChapter, randomBook.book);
  };

  const handleClearReading = () => {
    setVerses(null);
    setBookName("Select Book");
    setBookId("");
    setChapterId("");
    setTestamentFilter("");
    setShowDisplayMenu(false);
    showToast({
      title: "Cleared",
      message: "Reading section cleared. Select a new passage to continue.",
      variant: "success",
    });
  };

  const addToFavorites = () => {
    if (!verses || bookName === "Select Book" || chapterId === "") return;

    const alreadySaved = favoriteVerses.some(
      (favorite) =>
        favorite.book === bookName && favorite.chapter === chapterId,
    );

    if (alreadySaved) {
      showToast({
        title: "Already saved",
        message: "This chapter is already in your favorites.",
        variant: "info",
      });
      return;
    }

    const next = [
      ...favoriteVerses,
      {
        id: Date.now(),
        verse: verses.map((entry) => `${entry.verseId}. ${entry.verse}`),
        book: bookName,
        chapter: chapterId as number,
        date: new Date().toLocaleDateString(),
      },
    ];

    setFavoriteVerses(next);
    saveFavorites(next);
    showToast({
      title: "Added to favorites",
      message: "This reading has been saved to your favorites.",
      variant: "success",
    });
  };

  const removeFavorite = (id: number) => {
    const next = favoriteVerses.filter((favorite) => favorite.id !== id);
    setFavoriteVerses(next);
    saveFavorites(next);
    if (expandedFavoriteId === id) setExpandedFavoriteId(null);
  };

  const openFavorite = (favorite: FavoriteVerse) => {
    const book = BOOKS.find((entry) => entry.book === favorite.book);
    if (!book) return;

    setTestamentFilter(book.testament);
    setBookName(book.book);
    setBookId(book.id);
    setModal(null);
    void loadChapter(book.id, favorite.chapter, book.book);
  };

  const showFavorites = () => {
    if (favoriteVerses.length === 0) {
      setModal({
        title: "No favorites yet",
        message:
          "Start reading and bookmark passages to build your favorites list.",
        variant: "info",
        mode: "info",
      });
      return;
    }

    setModal({
      title: "Your favorite verses",
      message: `${favoriteVerses.length} saved reading(s).`,
      variant: "success",
      mode: "favorites",
    });
  };

  const handleCopyChapter = async () => {
    if (!verses || bookName === "Select Book" || chapterId === "") return;

    const text = verses
      .map((entry) => `${entry.verseId}. ${entry.verse}`)
      .join("\n");
    const reference = `${bookName} ${chapterId}`;

    try {
      await navigator.clipboard.writeText(`${reference}\n\n${text}`);
      showToast({
        title: "Copied",
        message: `${reference} copied to clipboard.`,
        variant: "success",
      });
    } catch {
      showToast({
        title: "Copy failed",
        message: "Unable to copy to clipboard.",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (!isReading) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevChapter();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNextChapter();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isReading, handleNextChapter, handlePrevChapter]);

  const fontSizeClass = readingFontSize(readingMode);
  const panelClass = readingPanelClass(readingTheme);

  return (
    <div className="px-4 py-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </div>

        <header className="flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">{currentDate}</p>
            <p className="mt-1 text-sm italic text-stone-600">
              &ldquo;Your word is a lamp to my feet and a light to my path&rdquo;
              &mdash; Psalm 119:105
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRandomVerse}
              disabled={isLoading}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
              title="Random chapter"
            >
              Random
            </button>
            <button
              type="button"
              onClick={showFavorites}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              title="View favorites"
            >
              Favorites{favoriteVerses.length > 0 ? ` (${favoriteVerses.length})` : ""}
            </button>
          </div>
        </header>

        {!isReading && (
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold text-stone-800">
              Choose a passage
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Select a testament and book, then pick a chapter below.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-stone-600">
                  Testament
                </span>
                <select
                  value={testamentFilter}
                  onChange={(event) => {
                    const value = event.target.value as Testament | "";
                    setTestamentFilter(value);
                    setBookName("Select Book");
                    setBookId("");
                    setChapterId("");
                  }}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select Testament</option>
                  <option value="OT">Old Testament</option>
                  <option value="NT">New Testament</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-stone-600">
                  Book
                </span>
                <select
                  value={bookName === "Select Book" ? "" : bookName}
                  onChange={(event) => {
                    const value = event.target.value;
                    const book = BOOKS.find((entry) => entry.book === value);
                    setBookName(value || "Select Book");
                    setBookId(book?.id ?? "");
                    setChapterId("");
                  }}
                  disabled={!testamentFilter}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-400"
                >
                  <option value="">Select Book</option>
                  {bookList.map((book) => (
                    <option key={book} value={book}>
                      {book}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {chapterNumbers.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-stone-600">
                  Chapter
                </p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
                  {chapterNumbers.map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => handleChapterSelect(number)}
                      className={`rounded-lg border px-2 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                        chapterId === number
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleOpenReading}
                disabled={isLoading || bookId === "" || chapterId === ""}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Loading…" : "Read chapter"}
              </button>
            </div>
          </section>
        )}

        {(isLoading || verses) && (
          <section
            ref={readingPanelRef}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md"
          >
            <div className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">
                    {bookName !== "Select Book" ? bookName : "Reading"}
                    {chapterId !== "" ? ` ${chapterId}` : ""}
                  </h2>
                  <p className="text-sm text-stone-500">
                    Use ← → arrow keys to navigate chapters
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDisplayMenu((prev) => !prev)}
                      className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      aria-expanded={showDisplayMenu}
                      aria-haspopup="true"
                    >
                      Display
                    </button>

                    {showDisplayMenu && (
                      <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-stone-200 bg-white p-3 shadow-lg">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                          Text size
                        </p>
                        <div className="mb-3 flex flex-wrap gap-1">
                          {READING_MODE_CYCLE.map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setReadingMode(mode)}
                              className={`rounded-md px-2 py-1 text-xs font-medium ${
                                readingMode === mode
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                              }`}
                            >
                              {READING_MODE_LABEL[mode]}
                            </button>
                          ))}
                        </div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                          Theme
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {READING_THEME_CYCLE.map((theme) => (
                            <button
                              key={theme}
                              type="button"
                              onClick={() => setReadingTheme(theme)}
                              className={`rounded-md px-2 py-1 text-xs font-medium ${
                                readingTheme === theme
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                              }`}
                            >
                              {READING_THEME_LABEL[theme]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={addToFavorites}
                    disabled={!verses}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
                    title="Bookmark chapter"
                  >
                    Bookmark
                  </button>
                  <button
                    type="button"
                    onClick={handleClearReading}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-400 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    title="Clear reading"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevChapter}
                  disabled={!canGoPrev || isLoading}
                  className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-sm text-stone-500">
                  Chapter {chapterId !== "" ? chapterId : "—"}
                  {currentBook ? ` of ${currentBook.chapters}` : ""}
                </span>
                <button
                  type="button"
                  onClick={handleNextChapter}
                  disabled={!canGoNext || isLoading}
                  className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className={`reading-scroll max-h-[70vh] overflow-y-auto p-6 md:p-8 ${panelClass}`}>
              {isLoading ? (
                <ReadingSkeleton />
              ) : verses ? (
                <VerseText verses={verses} fontSizeClass={fontSizeClass} />
              ) : null}
            </div>

            {verses && (
              <div className="flex flex-wrap justify-center gap-3 border-t border-stone-200 bg-stone-50 px-4 py-4">
                <button
                  type="button"
                  onClick={addToFavorites}
                  className="rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Bookmark chapter
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopyChapter()}
                  className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-200"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={handleClearReading}
                  className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  Clear
                </button>
              </div>
            )}
          </section>
        )}

        {!isReading && (
          <>
            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-stone-800">
                Your reading journey
              </h3>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-stone-600">
                <span>
                  <strong className="text-stone-800">{journey.chaptersReadSession}</strong>{" "}
                  {journey.chaptersReadSession === 1 ? "chapter" : "chapters"} this session
                </span>
                <span aria-hidden>·</span>
                <span>
                  <strong className="text-stone-800">{journey.chaptersReadWeek}</strong>{" "}
                  this week
                </span>
                <span aria-hidden>·</span>
                <span>
                  <strong className="text-stone-800">{journey.streak}</strong>-day streak
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-800">
                  Today&apos;s inspiration
                </h3>
                <button
                  type="button"
                  onClick={() => setShowInspiration((prev) => !prev)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline"
                >
                  {showInspiration ? "Hide" : "Show"}
                </button>
              </div>
              {showInspiration && (
                <p className="mt-3 text-center text-sm italic leading-relaxed text-stone-600">
                  &ldquo;The Bible is the greatest of all books because it is the
                  Word of God and contains the revelation of His character and
                  will.&rdquo;
                </p>
              )}
            </section>
          </>
        )}
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-xl px-5 py-4 shadow-2xl ${
            toast.variant === "error"
              ? "bg-red-600 text-white"
              : toast.variant === "success"
                ? "bg-emerald-600 text-white"
                : "bg-stone-800 text-white"
          }`}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{toast.title}</p>
              <p className="mt-1 text-sm opacity-90">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="shrink-0 text-sm opacity-80 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h4 id="modal-title" className="text-xl font-bold text-stone-900">
              {modal.title}
            </h4>
            <p className="mt-2 text-stone-600">{modal.message}</p>

            {modal.mode === "favorites" && (
              <ul className="mt-4 space-y-3">
                {favoriteVerses.map((favorite) => {
                  const isExpanded = expandedFavoriteId === favorite.id;
                  const preview = favorite.verse.slice(0, 3).join(" ");
                  const fullText = favorite.verse.join(" ");

                  return (
                    <li
                      key={favorite.id}
                      className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-left text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => openFavorite(favorite)}
                          className="text-left font-semibold text-indigo-700 hover:underline"
                        >
                          {favorite.book} Chapter {favorite.chapter}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFavorite(favorite.id)}
                          className="shrink-0 text-xs font-medium text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-stone-500">{favorite.date}</p>
                      <p className="mt-2 italic text-stone-600">
                        {isExpanded ? fullText : preview}
                        {!isExpanded && favorite.verse.length > 3 ? "…" : ""}
                      </p>
                      {favorite.verse.length > 3 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedFavoriteId(isExpanded ? null : favorite.id)
                          }
                          className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <button
              type="button"
              onClick={() => setModal(null)}
              className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
