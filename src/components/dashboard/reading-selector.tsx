"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { BOOKS } from "@/constants/books";
import type { Testament } from "@/types/bible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReadingSelectorProps {
  testamentFilter: Testament | "";
  setTestamentFilter: (value: Testament | "") => void;
  bookName: string;
  setBookName: (value: string) => void;
  setBookId: (value: number | "") => void;
  chapterId: number | "";
  setChapterId: (value: number | "") => void;
  bookList: string[];
  chapterNumbers: number[];
  isLoading: boolean;
  onOpenReading: () => void;
}

const selectClass =
  "flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ReadingSelector({
  testamentFilter,
  setTestamentFilter,
  bookName,
  setBookName,
  setBookId,
  chapterId,
  setChapterId,
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
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Testament
              </span>
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
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Book</span>
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
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Chapter
              </span>
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
            </label>
          </div>

          <div className="flex justify-end">
            <Button size="lg" onClick={onOpenReading} disabled={isLoading}>
              {isLoading ? "Loading…" : "Open Reading"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
