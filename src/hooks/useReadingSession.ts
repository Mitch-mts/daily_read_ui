"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "@/constants/books";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { loadJourney, recordChapterRead } from "@/lib/readingJourney";
import { useBibleChapter } from "@/hooks/useBibleChapter";
import type {
  FavoriteVerse,
  ParsedVerse,
  ReadingMode,
  Testament,
} from "@/types/bible";

export type ToastVariant = "success" | "error" | "info";

export interface ToastState {
  title: string;
  message: string;
  variant: ToastVariant;
}

export type ModalMode = "favorites" | "info";

export interface ModalState {
  title: string;
  message: string;
  variant: ToastVariant;
  mode: ModalMode;
}

const READING_MODES: ReadingMode[] = ["normal", "large", "extra-large"];

export function useReadingSession() {
  const { fetchChapter, isLoading } = useBibleChapter();
  const readingPanelRef = useRef<HTMLElement>(null);

  const [testamentFilter, setTestamentFilter] = useState<Testament | "">("");
  const [bookName, setBookName] = useState("Select Book");
  const [bookId, setBookId] = useState<number | "">("");
  const [chapterId, setChapterId] = useState<number | "">("");
  const [verses, setVerses] = useState<ParsedVerse[] | null>(null);
  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);
  const [expandedFavoriteId, setExpandedFavoriteId] = useState<number | null>(null);
  const [journey, setJourney] = useState(loadJourney);
  const [readingMode, setReadingMode] = useState<ReadingMode>("normal");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const [hasLastReading, setHasLastReading] = useState(false);

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
    return Array.from({ length: currentBook.chapters }, (_, i) => i + 1);
  }, [currentBook]);

  const canGoPrev = chapterId !== "" && chapterId > 1;
  const canGoNext =
    chapterId !== "" &&
    currentBook !== undefined &&
    chapterId < currentBook.chapters;

  const isReading = verses !== null || isLoading;
  const verseCount = verses?.length ?? 0;
  const booksReadCount = useMemo(() => {
    const unique = new Set(
      favoriteVerses.map((f) => f.book).concat(bookName !== "Select Book" ? [bookName] : []),
    );
    return unique.size;
  }, [favoriteVerses, bookName]);

  const progressPercent = Math.min(
    100,
    Math.round((journey.chaptersReadWeek / 7) * 100) || 0,
  );

  useEffect(() => {
    setFavoriteVerses(loadFavorites());
    setJourney(loadJourney());
    try {
      const last = localStorage.getItem("daily-reader-last");
      setHasLastReading(!!last);
    } catch {
      setHasLastReading(false);
    }
  }, []);

  const showToast = useCallback((next: ToastState) => {
    setToast(next);
    window.setTimeout(() => setToast(null), next.variant === "error" ? 4000 : 2500);
  }, []);

  const applyChapterResponse = useCallback(
    (
      data: Awaited<ReturnType<typeof fetchChapter>>,
      selectedChapterId: number,
      selectedBookId: number,
      selectedBookName: string,
      selectedTestament: Testament | "",
    ) => {
      const parsed = data.result.map((entry) => ({
        verseId: entry.verseId,
        verse: entry.verse,
      }));
      setVerses(parsed);
      setChapterId(selectedChapterId);
      setJourney(recordChapterRead());
      setHasLastReading(true);
      localStorage.setItem(
        "daily-reader-last",
        JSON.stringify({
          bookId: selectedBookId,
          bookName: selectedBookName,
          chapterId: selectedChapterId,
          testamentFilter: selectedTestament,
        }),
      );
      setLiveMessage(
        `Loaded ${selectedBookName} chapter ${selectedChapterId}, ${parsed.length} verses.`,
      );
    },
    [],
  );

  const loadChapter = useCallback(
    async (
      selectedBookId: number,
      selectedChapterId: number,
      selectedBookName: string,
    ) => {
      setVerses(null);
      setLiveMessage(`Loading ${selectedBookName} chapter ${selectedChapterId}…`);

      const book = BOOKS.find((b) => b.id === selectedBookId);

      try {
        const data = await fetchChapter(selectedBookId, selectedChapterId);
        applyChapterResponse(
          data,
          selectedChapterId,
          selectedBookId,
          selectedBookName,
          book?.testament ?? testamentFilter,
        );
        readingPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Service temporarily unavailable";
        setLiveMessage(message);
        showToast({ title: "Error", message, variant: "error" });
      }
    },
    [applyChapterResponse, fetchChapter, showToast, testamentFilter],
  );

  const handleOpenReading = useCallback(() => {
    if (bookId === "" || chapterId === "") {
      showToast({
        title: "Selection required",
        message: "Please choose a testament, book, and chapter.",
        variant: "info",
      });
      return;
    }
    void loadChapter(bookId, chapterId, bookName);
  }, [bookId, bookName, chapterId, loadChapter, showToast]);

  const handleContinueReading = useCallback(() => {
    try {
      const raw = localStorage.getItem("daily-reader-last");
      if (!raw) {
        showToast({ title: "No recent reading", message: "Start a new chapter first.", variant: "info" });
        return;
      }
      const last = JSON.parse(raw) as {
        bookId: number;
        bookName: string;
        chapterId: number;
        testamentFilter: Testament;
      };
      setBookId(last.bookId);
      setBookName(last.bookName);
      setChapterId(last.chapterId);
      setTestamentFilter(last.testamentFilter);
      void loadChapter(last.bookId, last.chapterId, last.bookName);
    } catch {
      showToast({ title: "Error", message: "Could not restore last reading.", variant: "error" });
    }
  }, [loadChapter, showToast]);

  const handlePrevChapter = useCallback(() => {
    if (bookId === "" || !canGoPrev || typeof chapterId !== "number") return;
    void loadChapter(bookId, chapterId - 1, bookName);
  }, [bookId, bookName, canGoPrev, chapterId, loadChapter]);

  const handleNextChapter = useCallback(() => {
    if (bookId === "" || !canGoNext || typeof chapterId !== "number") return;
    void loadChapter(bookId, chapterId + 1, bookName);
  }, [bookId, bookName, canGoNext, chapterId, loadChapter]);

  const handleRandomVerse = useCallback(() => {
    const randomBook = BOOKS[Math.floor(Math.random() * BOOKS.length)];
    const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;

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
  }, [loadChapter, showToast]);

  const handleClearReading = useCallback(() => {
    setVerses(null);
    showToast({
      title: "Cleared",
      message: "Reading cleared. Your selections are preserved.",
      variant: "success",
    });
  }, [showToast]);

  const increaseFont = useCallback(() => {
    setReadingMode((current) => {
      const idx = READING_MODES.indexOf(current);
      return READING_MODES[Math.min(idx + 1, READING_MODES.length - 1)];
    });
  }, []);

  const decreaseFont = useCallback(() => {
    setReadingMode((current) => {
      const idx = READING_MODES.indexOf(current);
      return READING_MODES[Math.max(idx - 1, 0)];
    });
  }, []);

  const addToFavorites = useCallback(() => {
    if (!verses || bookName === "Select Book" || chapterId === "") return;

    const alreadySaved = favoriteVerses.some(
      (f) => f.book === bookName && f.chapter === chapterId,
    );

    if (alreadySaved) {
      showToast({ title: "Already saved", message: "This chapter is in your favorites.", variant: "info" });
      return;
    }

    const next = [
      ...favoriteVerses,
      {
        id: Date.now(),
        verse: verses.map((e) => `${e.verseId}. ${e.verse}`),
        book: bookName,
        chapter: chapterId as number,
        date: new Date().toLocaleDateString(),
      },
    ];

    setFavoriteVerses(next);
    saveFavorites(next);
    showToast({ title: "Bookmarked", message: "Chapter saved to favorites.", variant: "success" });
  }, [bookName, chapterId, favoriteVerses, showToast, verses]);

  const removeFavorite = useCallback((id: number) => {
    const next = favoriteVerses.filter((f) => f.id !== id);
    setFavoriteVerses(next);
    saveFavorites(next);
    if (expandedFavoriteId === id) setExpandedFavoriteId(null);
  }, [expandedFavoriteId, favoriteVerses]);

  const openFavorite = useCallback(
    (favorite: FavoriteVerse) => {
      const book = BOOKS.find((e) => e.book === favorite.book);
      if (!book) return;
      setTestamentFilter(book.testament);
      setBookName(book.book);
      setBookId(book.id);
      setModal(null);
      void loadChapter(book.id, favorite.chapter, book.book);
    },
    [loadChapter],
  );

  const showFavorites = useCallback(() => {
    if (favoriteVerses.length === 0) {
      setModal({
        title: "No favorites yet",
        message: "Bookmark chapters as you read to build your collection.",
        variant: "info",
        mode: "info",
      });
      return;
    }
    setModal({
      title: "Your favorites",
      message: `${favoriteVerses.length} saved chapter(s).`,
      variant: "success",
      mode: "favorites",
    });
  }, [favoriteVerses.length]);

  const handleCopyChapter = useCallback(async () => {
    if (!verses || bookName === "Select Book" || chapterId === "") return;
    const text = verses.map((e) => `${e.verseId}. ${e.verse}`).join("\n");
    const reference = `${bookName} ${chapterId}`;
    try {
      await navigator.clipboard.writeText(`${reference}\n\n${text}`);
      showToast({ title: "Copied", message: `${reference} copied.`, variant: "success" });
    } catch {
      showToast({ title: "Copy failed", message: "Unable to copy.", variant: "error" });
    }
  }, [bookName, chapterId, showToast, verses]);

  const showComingSoon = useCallback((feature: string) => {
    setModal({
      title: feature,
      message: `${feature} will be available in a future release.`,
      variant: "info",
      mode: "info",
    });
  }, []);

  useEffect(() => {
    if (!isReading) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
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

  return {
    readingPanelRef,
    testamentFilter,
    setTestamentFilter,
    bookName,
    setBookName,
    bookId,
    setBookId,
    chapterId,
    setChapterId,
    verses,
    favoriteVerses,
    expandedFavoriteId,
    setExpandedFavoriteId,
    journey,
    readingMode,
    toast,
    setToast,
    modal,
    setModal,
    liveMessage,
    hasLastReading,
    currentBook,
    bookList,
    chapterNumbers,
    canGoPrev,
    canGoNext,
    isReading,
    isLoading,
    verseCount,
    booksReadCount,
    progressPercent,
    handleOpenReading,
    handleContinueReading,
    handlePrevChapter,
    handleNextChapter,
    handleRandomVerse,
    handleClearReading,
    increaseFont,
    decreaseFont,
    addToFavorites,
    removeFavorite,
    openFavorite,
    showFavorites,
    handleCopyChapter,
    showComingSoon,
  };
}
