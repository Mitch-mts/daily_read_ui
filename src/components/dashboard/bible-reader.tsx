"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Volume2,
  X,
} from "lucide-react";
import type { ParsedVerse, ReadingMode } from "@/types/bible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const VERSES_PER_PAGE = 5;

function fontSizeClass(mode: ReadingMode): string {
  if (mode === "large") return "text-xl md:text-2xl";
  if (mode === "extra-large") return "text-2xl md:text-3xl";
  return "text-lg md:text-xl";
}

function ReadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 py-6">
      {Array.from({ length: VERSES_PER_PAGE }, (_, i) => (
        <Skeleton key={i} className="h-5" style={{ width: `${60 + (i % 3) * 12}%` }} />
      ))}
    </div>
  );
}

function VerseText({
  verses,
  mode,
}: {
  verses: ParsedVerse[];
  mode: ReadingMode;
}) {
  return (
    <article className={`mx-auto w-full max-w-2xl font-scripture ${fontSizeClass(mode)}`}>
      {verses.map((entry) => (
        <p key={entry.verseId} className="verse-line">
          <sup className="verse-num">{entry.verseId}</sup>
          <span>{entry.verse}</span>
        </p>
      ))}
    </article>
  );
}

interface BibleReaderProps {
  panelRef: React.RefObject<HTMLElement | null>;
  bookName: string;
  chapterId: number | "";
  currentBookChapters?: number;
  verses: ParsedVerse[] | null;
  isLoading: boolean;
  readingMode: ReadingMode;
  canGoPrev: boolean;
  canGoNext: boolean;
  verseCount: number;
  onPrev: () => void;
  onNext: () => void;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onClear: () => void;
  onAudio: () => void;
  chapterProgress?: number;
}

export function BibleReader({
  panelRef,
  bookName,
  chapterId,
  currentBookChapters,
  verses,
  isLoading,
  readingMode,
  canGoPrev,
  canGoNext,
  verseCount,
  onPrev,
  onNext,
  onIncreaseFont,
  onDecreaseFont,
  onShare,
  onBookmark,
  onClear,
  onAudio,
}: BibleReaderProps) {
  const [page, setPage] = useState(0);

  // Reset to the first page whenever a new passage loads.
  useEffect(() => {
    setPage(0);
  }, [verses]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((verses?.length ?? 0) / VERSES_PER_PAGE)),
    [verses],
  );

  const safePage = Math.min(page, totalPages - 1);

  const pageVerses = useMemo(() => {
    if (!verses) return [];
    const start = safePage * VERSES_PER_PAGE;
    return verses.slice(start, start + VERSES_PER_PAGE);
  }, [verses, safePage]);

  if (!isLoading && !verses) return null;

  const isFirstPage = safePage === 0;
  const isLastPage = safePage >= totalPages - 1;

  const firstVerseNo = pageVerses[0]?.verseId;
  const lastVerseNo = pageVerses[pageVerses.length - 1]?.verseId;

  const pageProgress = verses
    ? Math.round(((safePage + 1) / totalPages) * 100)
    : 0;

  const handlePrev = () => {
    if (!isFirstPage) {
      setPage(safePage - 1);
    } else if (canGoPrev) {
      onPrev();
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      setPage(safePage + 1);
    } else if (canGoNext) {
      onNext();
    }
  };

  const prevDisabled = isLoading || (isFirstPage && !canGoPrev);
  const nextDisabled = isLoading || (isLastPage && !canGoNext);
  const prevLabel = isFirstPage ? "Prev chapter" : "Previous";
  const nextLabel = isLastPage ? "Next chapter" : "Next";

  return (
    <motion.section
      ref={panelRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="mx-auto max-w-3xl overflow-hidden shadow-soft">
        <CardHeader className="border-b border-border/60 bg-card/95">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-display text-2xl">
                {bookName}
                {chapterId !== "" ? ` ${chapterId}` : ""}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {verseCount > 0
                  ? firstVerseNo === lastVerseNo
                    ? `Verse ${firstVerseNo} of ${verseCount}`
                    : `Verses ${firstVerseNo}–${lastVerseNo} of ${verseCount}`
                  : "Loading scripture…"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <Button variant="ghost" size="icon" onClick={onDecreaseFont} aria-label="Decrease font">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onIncreaseFont} aria-label="Increase font">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onShare} aria-label="Share">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onBookmark} aria-label="Bookmark">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onAudio} aria-label="Audio">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClear} aria-label="Close reading">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Reading progress</span>
              <span>
                Page {safePage + 1} of {totalPages}
              </span>
            </div>
            <Progress value={pageProgress} className="h-1" />
          </div>
        </CardHeader>

        <CardContent className="reading-scroll flex min-h-[340px] max-h-[52vh] items-start overflow-y-auto p-6 md:p-10">
          {isLoading ? (
            <ReadingSkeleton />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={safePage}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <VerseText verses={pageVerses} mode={readingMode} />
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>

        <div className="flex items-center justify-between border-t border-border/60 bg-card/95 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={prevDisabled}
          >
            <ChevronLeft className="h-4 w-4" />
            {prevLabel}
          </Button>

          <span className="text-sm text-muted-foreground">
            {chapterId !== "" ? `Ch. ${chapterId}` : ""}
            {currentBookChapters ? ` of ${currentBookChapters}` : ""}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={nextDisabled}
          >
            {nextLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.section>
  );
}
