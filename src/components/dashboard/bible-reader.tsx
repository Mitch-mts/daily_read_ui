"use client";

import { motion } from "framer-motion";
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

function fontSizeClass(mode: ReadingMode): string {
  if (mode === "large") return "text-xl md:text-2xl";
  if (mode === "extra-large") return "text-2xl md:text-3xl";
  return "text-lg md:text-xl";
}

function ReadingSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-6">
      {Array.from({ length: 10 }, (_, i) => (
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
    <article className={`mx-auto max-w-2xl font-scripture ${fontSizeClass(mode)}`}>
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
  chapterProgress = 0,
}: BibleReaderProps) {
  if (!isLoading && !verses) return null;

  const readProgress = verses ? chapterProgress : 0;

  return (
    <motion.section
      ref={panelRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden shadow-soft">
        <CardHeader className="sticky top-0 z-10 border-b border-border/60 bg-card/95 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-display text-2xl">
                {bookName}
                {chapterId !== "" ? ` ${chapterId}` : ""}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {verseCount > 0 ? `${verseCount} verses` : "Loading scripture…"}
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
              <span>{readProgress}%</span>
            </div>
            <Progress value={readProgress} className="h-1" />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={!canGoPrev || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Ch. {chapterId !== "" ? chapterId : "—"}
              {currentBookChapters ? ` of ${currentBookChapters}` : ""}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!canGoNext || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="reading-scroll max-h-[65vh] overflow-y-auto p-6 md:p-10">
          {isLoading ? (
            <ReadingSkeleton />
          ) : verses ? (
            <VerseText verses={verses} mode={readingMode} />
          ) : null}
        </CardContent>
      </Card>
    </motion.section>
  );
}
