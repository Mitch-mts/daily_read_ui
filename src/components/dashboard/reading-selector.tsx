"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import { BOOKS } from "@/constants/books";
import type { Testament } from "@/types/bible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReadingSelectorProps {
  testamentFilter: Testament | "";
  setTestamentFilter: (value: Testament | "") => void;
  bookName: string;
  setBookName: (value: string) => void;
  setBookId: (value: number | "") => void;
  chapterId: number | "";
  setChapterId: (value: number | "") => void;
  verseId: number | "";
  setVerseId: (value: number | "") => void;
  readSingleVerse: boolean;
  setReadSingleVerse: (value: boolean) => void;
  bookList: string[];
  chapterNumbers: number[];
  isLoading: boolean;
  onOpenReading: () => void;
}

const selectClass =
  "h-14 w-full appearance-none rounded-xl border-2 border-input bg-background pl-4 pr-11 text-base font-medium text-foreground shadow-sm transition-all hover:border-primary/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50";

interface FieldProps {
  step: number;
  label: string;
  active: boolean;
  children: React.ReactNode;
}

function SelectField({ step, label, active, children }: FieldProps) {
  return (
    <label className="space-y-2">
      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
            active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {step}
        </span>
        {label}
      </span>
      <div className="relative">
        {children}
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </label>
  );
}

export function ReadingSelector({
  testamentFilter,
  setTestamentFilter,
  bookName,
  setBookName,
  setBookId,
  chapterId,
  setChapterId,
  verseId,
  setVerseId,
  readSingleVerse,
  setReadSingleVerse,
  bookList,
  chapterNumbers,
  isLoading,
  onOpenReading,
}: ReadingSelectorProps) {
  return (
    <motion.section
      id="read"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50 bg-card/90 shadow-soft backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Choose Your Passage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Follow the steps below to open a reading.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            <SelectField step={1} label="Testament" active={testamentFilter !== ""}>
              <select
                value={testamentFilter}
                onChange={(e) => {
                  const value = e.target.value as Testament | "";
                  setTestamentFilter(value);
                  setBookName("Select Book");
                  setBookId("");
                  setChapterId("");
                }}
                className={selectClass}
              >
                <option value="">Select Testament</option>
                <option value="OT">Old Testament</option>
                <option value="NT">New Testament</option>
              </select>
            </SelectField>

            <SelectField
              step={2}
              label="Book"
              active={bookName !== "Select Book" && bookName !== ""}
            >
              <select
                value={bookName === "Select Book" ? "" : bookName}
                onChange={(e) => {
                  const value = e.target.value;
                  const book = BOOKS.find((entry) => entry.book === value);
                  setBookName(value || "Select Book");
                  setBookId(book?.id ?? "");
                  setChapterId("");
                }}
                disabled={!testamentFilter}
                className={selectClass}
              >
                <option value="">Select Book</option>
                {bookList.map((book) => (
                  <option key={book} value={book}>
                    {book}
                  </option>
                ))}
              </select>
            </SelectField>

            <SelectField step={3} label="Chapter" active={chapterId !== ""}>
              <select
                value={chapterId}
                onChange={(e) =>
                  setChapterId(
                    e.target.value ? Number.parseInt(e.target.value, 10) : "",
                  )
                }
                disabled={chapterNumbers.length === 0}
                className={selectClass}
              >
                <option value="">Select Chapter</option>
                {chapterNumbers.map((n) => (
                  <option key={n} value={n}>
                    Chapter {n}
                  </option>
                ))}
              </select>
            </SelectField>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">
                How much to read
              </span>
              <div className="inline-flex rounded-xl border-2 border-input bg-background p-1">
                <button
                  type="button"
                  onClick={() => setReadSingleVerse(false)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    !readSingleVerse
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Full chapter
                </button>
                <button
                  type="button"
                  onClick={() => setReadSingleVerse(true)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    readSingleVerse
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Single verse
                </button>
              </div>
            </div>

            {readSingleVerse && (
              <label className="space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  Verse
                </span>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={verseId}
                  placeholder="e.g. 16"
                  onChange={(e) =>
                    setVerseId(
                      e.target.value
                        ? Math.max(1, Number.parseInt(e.target.value, 10) || 1)
                        : "",
                    )
                  }
                  disabled={chapterId === ""}
                  className="h-14 w-full rounded-xl border-2 border-input bg-background px-4 text-base font-medium text-foreground shadow-sm transition-all hover:border-primary/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
                />
              </label>
            )}

            <Button
              size="lg"
              onClick={onOpenReading}
              disabled={isLoading}
              className="sm:ml-auto"
            >
              {isLoading
                ? "Loading…"
                : readSingleVerse
                  ? "Read Verse"
                  : "Open Reading"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
