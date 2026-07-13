"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BOOKS } from "@/constants/books";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { addHistoryEntry, clearHistory, loadHistory } from "@/lib/history";
import { addNote, loadNotes, removeNote, updateNote } from "@/lib/notes";
import { loadJourney, recordChapterRead } from "@/lib/readingJourney";
import {
  loadPlanProgress,
  markPlanDayComplete,
  startPlan,
} from "@/lib/readingPlans";
import { useBibleChapter } from "@/hooks/useBibleChapter";
import type {
  FavoriteVerse,
  ParsedVerse,
  ReadingMode,
  Testament,
} from "@/types/bible";
import type {
  NavSection,
  PlanProgress,
  ReadingHistoryEntry,
  ReadingNote,
} from "@/types/dashboard";

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
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const spokenPassageRef = useRef<string | null>(null);

  const [testamentFilter, setTestamentFilter] = useState<Testament | "">("");
  const [bookName, setBookName] = useState("Select Book");
  const [bookId, setBookId] = useState<number | "">("");
  const [chapterId, setChapterId] = useState<number | "">("");
  const [verseId, setVerseId] = useState<number | "">("");
  const [readSingleVerse, setReadSingleVerse] = useState(false);
  const [activeVerseId, setActiveVerseId] = useState<number | null>(null);
  const [verses, setVerses] = useState<ParsedVerse[] | null>(null);
  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);
  const [expandedFavoriteId, setExpandedFavoriteId] = useState<number | null>(null);
  const [journey, setJourney] = useState(() => {
    // Always start with the same default on server + first client paint.
    // Local progress is loaded in useEffect after mount.
    return {
      chaptersReadSession: 0,
      chaptersReadWeek: 0,
      streak: 0,
      lastReadDate: null as string | null,
      weekStart: "",
    };
  });
  const [readingMode, setReadingMode] = useState<ReadingMode>("normal");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const [hasLastReading, setHasLastReading] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>("home");
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryEntry[]>([]);
  const [notes, setNotes] = useState<ReadingNote[]>([]);
  const [planProgress, setPlanProgress] = useState<PlanProgress[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

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

  const canGoPrev =
    activeVerseId !== null
      ? activeVerseId > 1
      : chapterId !== "" && chapterId > 1;
  const canGoNext =
    activeVerseId !== null
      ? true
      : chapterId !== "" &&
        currentBook !== undefined &&
        chapterId < currentBook.chapters;

  const passageReference = useMemo(() => {
    if (bookName === "Select Book" || chapterId === "") return "";
    return activeVerseId !== null
      ? `${bookName} ${chapterId}:${activeVerseId}`
      : `${bookName} ${chapterId}`;
  }, [activeVerseId, bookName, chapterId]);

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
    setReadingHistory(loadHistory());
    setNotes(loadNotes());
    setPlanProgress(loadPlanProgress());
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
      selectedVerse: number | null,
    ) => {
      const parsed = data.result.map((entry) => ({
        verseId: entry.verseId,
        verse: entry.verse,
      }));
      setVerses(parsed);
      setChapterId(selectedChapterId);
      setActiveVerseId(selectedVerse);
      setJourney(recordChapterRead());
      setHasLastReading(true);
      setReadingHistory(
        addHistoryEntry({
          bookId: selectedBookId,
          bookName: selectedBookName,
          chapterId: selectedChapterId,
          verseId: selectedVerse ?? undefined,
          testamentFilter: (selectedTestament || "OT") as Testament,
        }),
      );
      localStorage.setItem(
        "daily-reader-last",
        JSON.stringify({
          bookId: selectedBookId,
          bookName: selectedBookName,
          chapterId: selectedChapterId,
          verseId: selectedVerse,
          testamentFilter: selectedTestament,
        }),
      );
      setLiveMessage(
        selectedVerse !== null
          ? `Loaded ${selectedBookName} ${selectedChapterId}:${selectedVerse}.`
          : `Loaded ${selectedBookName} chapter ${selectedChapterId}, ${parsed.length} verses.`,
      );
    },
    [],
  );

  const loadChapter = useCallback(
    async (
      selectedBookId: number,
      selectedChapterId: number,
      selectedBookName: string,
      selectedVerse?: number,
    ) => {
      setVerses(null);
      setLiveMessage(
        selectedVerse !== undefined
          ? `Loading ${selectedBookName} ${selectedChapterId}:${selectedVerse}…`
          : `Loading ${selectedBookName} chapter ${selectedChapterId}…`,
      );

      const book = BOOKS.find((b) => b.id === selectedBookId);

      try {
        const data = await fetchChapter(
          selectedBookId,
          selectedChapterId,
          selectedVerse,
        );
        applyChapterResponse(
          data,
          selectedChapterId,
          selectedBookId,
          selectedBookName,
          book?.testament ?? testamentFilter,
          selectedVerse ?? null,
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
    if (readSingleVerse && verseId === "") {
      showToast({
        title: "Verse required",
        message: "Enter a verse number to read a single verse.",
        variant: "info",
      });
      return;
    }
    void loadChapter(
      bookId,
      chapterId,
      bookName,
      readSingleVerse ? (verseId as number) : undefined,
    );
  }, [bookId, bookName, chapterId, loadChapter, readSingleVerse, showToast, verseId]);

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
        verseId?: number | null;
        testamentFilter: Testament;
      };
      const lastVerse =
        typeof last.verseId === "number" ? last.verseId : undefined;
      setBookId(last.bookId);
      setBookName(last.bookName);
      setChapterId(last.chapterId);
      setTestamentFilter(last.testamentFilter);
      setReadSingleVerse(lastVerse !== undefined);
      setVerseId(lastVerse ?? "");
      void loadChapter(last.bookId, last.chapterId, last.bookName, lastVerse);
    } catch {
      showToast({ title: "Error", message: "Could not restore last reading.", variant: "error" });
    }
  }, [loadChapter, showToast]);

  const handlePrevChapter = useCallback(() => {
    if (bookId === "" || !canGoPrev || typeof chapterId !== "number") return;
    if (activeVerseId !== null) {
      void loadChapter(bookId, chapterId, bookName, activeVerseId - 1);
      return;
    }
    void loadChapter(bookId, chapterId - 1, bookName);
  }, [activeVerseId, bookId, bookName, canGoPrev, chapterId, loadChapter]);

  const handleNextChapter = useCallback(() => {
    if (bookId === "" || !canGoNext || typeof chapterId !== "number") return;
    if (activeVerseId !== null) {
      void loadChapter(bookId, chapterId, bookName, activeVerseId + 1);
      return;
    }
    void loadChapter(bookId, chapterId + 1, bookName);
  }, [activeVerseId, bookId, bookName, canGoNext, chapterId, loadChapter]);

  const handleRandomVerse = useCallback(async () => {
    const randomBook = BOOKS[Math.floor(Math.random() * BOOKS.length)];
    const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;

    setBookName(randomBook.book);
    setBookId(randomBook.id);
    setChapterId(randomChapter);
    setTestamentFilter(randomBook.testament);
    setActiveSection("read");
    setLiveMessage(
      `Finding a verse in ${randomBook.book} chapter ${randomChapter}…`,
    );

    try {
      const data = await fetchChapter(randomBook.id, randomChapter);
      if (!data.result.length) {
        throw new Error("No verses found for that selection.");
      }

      const randomVerse =
        data.result[Math.floor(Math.random() * data.result.length)];
      setReadSingleVerse(true);
      setVerseId(randomVerse.verseId);

      showToast({
        title: "Random verse",
        message: `${randomBook.book} ${randomChapter}:${randomVerse.verseId}`,
        variant: "info",
      });

      void loadChapter(
        randomBook.id,
        randomChapter,
        randomBook.book,
        randomVerse.verseId,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load a random verse";
      setLiveMessage(message);
      showToast({ title: "Error", message, variant: "error" });
    }
  }, [fetchChapter, loadChapter, showToast]);

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

  const saveFavorite = useCallback(
    (
      book: string,
      chapter: number,
      verseLines: string[],
      verseId: number | null,
    ) => {
      const alreadySaved = favoriteVerses.some(
        (f) =>
          f.book === book &&
          f.chapter === chapter &&
          (f.verseId ?? null) === verseId,
      );

      if (alreadySaved) {
        showToast({
          title: "Already saved",
          message:
            verseId !== null
              ? "This verse is in your favorites."
              : "This chapter is in your favorites.",
          variant: "info",
        });
        return false;
      }

      const next = [
        ...favoriteVerses,
        {
          id: Date.now(),
          verse: verseLines,
          book,
          chapter,
          verseId: verseId ?? undefined,
          date: new Date().toLocaleDateString(),
        },
      ];

      setFavoriteVerses(next);
      saveFavorites(next);
      showToast({
        title: "Bookmarked",
        message:
          verseId !== null
            ? "Verse saved to favorites."
            : "Chapter saved to favorites.",
        variant: "success",
      });
      return true;
    },
    [favoriteVerses, showToast],
  );

  const addToFavorites = useCallback(() => {
    if (!verses || bookName === "Select Book" || chapterId === "") return;
    saveFavorite(
      bookName,
      chapterId as number,
      verses.map((e) => `${e.verseId}. ${e.verse}`),
      activeVerseId,
    );
  }, [activeVerseId, bookName, chapterId, saveFavorite, verses]);

  const addVerseToFavorites = useCallback(
    (verseId: number, verseText: string) => {
      if (bookName === "Select Book" || chapterId === "") return;
      saveFavorite(
        bookName,
        chapterId as number,
        [`${verseId}. ${verseText}`],
        verseId,
      );
    },
    [bookName, chapterId, saveFavorite],
  );

  const isVerseFavorited = useCallback(
    (verseId: number) =>
      favoriteVerses.some(
        (f) =>
          f.book === bookName &&
          f.chapter === chapterId &&
          f.verseId === verseId,
      ),
    [bookName, chapterId, favoriteVerses],
  );

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
      setReadSingleVerse(favorite.verseId !== undefined);
      setVerseId(favorite.verseId ?? "");
      setModal(null);
      setActiveSection("read");
      void loadChapter(book.id, favorite.chapter, book.book, favorite.verseId);
    },
    [loadChapter],
  );

  const openHistoryEntry = useCallback(
    (entry: ReadingHistoryEntry) => {
      setTestamentFilter(entry.testamentFilter);
      setBookName(entry.bookName);
      setBookId(entry.bookId);
      setChapterId(entry.chapterId);
      setReadSingleVerse(entry.verseId !== undefined);
      setVerseId(entry.verseId ?? "");
      setActiveSection("read");
      void loadChapter(
        entry.bookId,
        entry.chapterId,
        entry.bookName,
        entry.verseId,
      );
    },
    [loadChapter],
  );

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setReadingHistory([]);
    showToast({ title: "Cleared", message: "Reading history cleared.", variant: "success" });
  }, [showToast]);

  const handleAddNote = useCallback(
    (text: string) => {
      if (bookName === "Select Book" || chapterId === "") {
        showToast({
          title: "No passage selected",
          message: "Open a reading first to attach a note.",
          variant: "info",
        });
        return;
      }
      setNotes(
        addNote(bookName, chapterId as number, text, activeVerseId ?? undefined),
      );
      showToast({ title: "Note saved", message: "Your reflection was saved.", variant: "success" });
    },
    [activeVerseId, bookName, chapterId, showToast],
  );

  const handleUpdateNote = useCallback((id: number, text: string) => {
    setNotes(updateNote(id, text));
    showToast({ title: "Updated", message: "Note updated.", variant: "success" });
  }, [showToast]);

  const handleRemoveNote = useCallback((id: number) => {
    setNotes(removeNote(id));
    showToast({ title: "Removed", message: "Note deleted.", variant: "success" });
  }, [showToast]);

  const handleStartPlan = useCallback(
    (planId: string) => {
      setPlanProgress(startPlan(planId));
      showToast({ title: "Plan started", message: "Your reading plan is now active.", variant: "success" });
    },
    [showToast],
  );

  const handleMarkPlanDay = useCallback(
    (planId: string) => {
      setPlanProgress(markPlanDayComplete(planId));
      showToast({ title: "Day complete", message: "Nice work — day marked complete.", variant: "success" });
    },
    [showToast],
  );

  const navigateToSection = useCallback((section: NavSection) => {
    setActiveSection(section);
  }, []);

  const showFavorites = useCallback(() => {
    setActiveSection("favorites");
  }, []);

  const handleCopyChapter = useCallback(async () => {
    if (!verses || bookName === "Select Book" || chapterId === "") return;
    const text = verses.map((e) => `${e.verseId}. ${e.verse}`).join("\n");
    const reference =
      activeVerseId !== null
        ? `${bookName} ${chapterId}:${activeVerseId}`
        : `${bookName} ${chapterId}`;
    try {
      await navigator.clipboard.writeText(`${reference}\n\n${text}`);
      showToast({ title: "Copied", message: `${reference} copied.`, variant: "success" });
    } catch {
      showToast({ title: "Copy failed", message: "Unable to copy.", variant: "error" });
    }
  }, [activeVerseId, bookName, chapterId, showToast, verses]);

  const showComingSoon = useCallback((feature: string) => {
    setModal({
      title: feature,
      message: `${feature} will be available in a future release.`,
      variant: "info",
      mode: "info",
    });
  }, []);

  const handleAudioPlayback = useCallback(() => {
    if (!verses || bookName === "Select Book" || chapterId === "") {
      showToast({
        title: "No passage open",
        message: "Open a chapter or verse before using audio.",
        variant: "info",
      });
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      showToast({
        title: "Audio unavailable",
        message: "Your browser does not support built-in voice playback.",
        variant: "error",
      });
      return;
    }

    const synth = window.speechSynthesis;

    if (synth.speaking || synth.pending) {
      synth.cancel();
      speechRef.current = null;
      spokenPassageRef.current = null;
      setIsAudioPlaying(false);
      showToast({
        title: "Audio stopped",
        message: "Voice playback has been stopped.",
        variant: "info",
      });
      return;
    }

    const reference =
      activeVerseId !== null
        ? `${bookName} chapter ${chapterId} verse ${activeVerseId}`
        : `${bookName} chapter ${chapterId}`;
    const spokenText = verses.map((entry) => `Verse ${entry.verseId}. ${entry.verse}`).join(" ");
    const utterance = new SpeechSynthesisUtterance(`${reference}. ${spokenText}`);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => {
      spokenPassageRef.current = passageReference;
      setIsAudioPlaying(true);
    };
    utterance.onend = () => {
      speechRef.current = null;
      spokenPassageRef.current = null;
      setIsAudioPlaying(false);
    };
    utterance.onerror = () => {
      speechRef.current = null;
      spokenPassageRef.current = null;
      setIsAudioPlaying(false);
      showToast({
        title: "Audio error",
        message: "Voice playback could not be completed.",
        variant: "error",
      });
    };

    speechRef.current = utterance;
    synth.cancel();
    synth.speak(utterance);
  }, [activeVerseId, bookName, chapterId, showToast, verses]);

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

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    return () => {
      window.speechSynthesis.cancel();
      speechRef.current = null;
      spokenPassageRef.current = null;
      setIsAudioPlaying(false);
    };
  }, []);

  useEffect(() => {
    if (!isAudioPlaying) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!spokenPassageRef.current || spokenPassageRef.current === passageReference) return;
    window.speechSynthesis.cancel();
    speechRef.current = null;
    spokenPassageRef.current = null;
    setIsAudioPlaying(false);
  }, [isAudioPlaying, passageReference]);

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
    verseId,
    setVerseId,
    readSingleVerse,
    setReadSingleVerse,
    activeVerseId,
    passageReference,
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
    activeSection,
    setActiveSection,
    readingHistory,
    notes,
    planProgress,
    isAudioPlaying,
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
    addVerseToFavorites,
    isVerseFavorited,
    removeFavorite,
    openFavorite,
    openHistoryEntry,
    handleClearHistory,
    handleAddNote,
    handleUpdateNote,
    handleRemoveNote,
    handleStartPlan,
    handleMarkPlanDay,
    navigateToSection,
    showFavorites,
    handleCopyChapter,
    handleAudioPlayback,
    showComingSoon,
  };
}
