"use client";

import { useCallback, useState } from "react";
import type { ApiErrorResponse, ChapterResponse } from "@/types/bible";

interface UseBibleChapterResult {
  fetchChapter: (
    bookId: number,
    chapterId: number,
    verse?: number,
  ) => Promise<ChapterResponse>;
  isLoading: boolean;
  error: string | null;
}

export function useBibleChapter(): UseBibleChapterResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChapter = useCallback(
    async (
      bookId: number,
      chapterId: number,
      verse?: number,
    ): Promise<ChapterResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const query = verse ? `?verse=${verse}` : "";
        const response = await fetch(
          `/api/bible/book/${bookId}/chapter/${chapterId}${query}`,
        );

        if (!response.ok) {
          const body = (await response.json()) as ApiErrorResponse;
          throw new Error(body.message ?? "Failed to load chapter");
        }

        const data = (await response.json()) as ChapterResponse;
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load chapter";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { fetchChapter, isLoading, error };
}
