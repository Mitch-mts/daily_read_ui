import { BOOKS } from "@/constants/books";
import { env } from "@/lib/env";
import type {
  Book,
  ChapterResponse,
  ExternalBibleChapterResponse,
  Testament,
} from "@/types/bible";
import {
  ExternalServiceError,
  NotFoundError,
  ValidationError,
} from "@/utils/errors";

function toApiSlug(bookName: string): string {
  return bookName.toLowerCase();
}

function parsePositiveInt(value: string, label: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new ValidationError(`Invalid ${label}: must be a positive integer`);
  }
  return parsed;
}

export class BibleService {
  static getBooks(): Book[] {
    return BOOKS;
  }

  static getBookById(bookId: number): Book {
    const book = BOOKS.find((entry) => entry.id === bookId);
    if (!book) {
      throw new NotFoundError(`Book with id ${bookId} was not found`);
    }
    return book;
  }

  static async getChapter(
    bookIdParam: string,
    chapterIdParam: string,
  ): Promise<ChapterResponse> {
    const bookId = parsePositiveInt(bookIdParam, "bookId");
    const chapterId = parsePositiveInt(chapterIdParam, "chapterId");
    const book = BibleService.getBookById(bookId);

    if (chapterId > book.chapters) {
      throw new ValidationError(
        `${book.book} only has ${book.chapters} chapters`,
      );
    }

    const slug = toApiSlug(book.book);
    const query = env.bibleTranslation
      ? `?translation=${encodeURIComponent(env.bibleTranslation)}`
      : "";
    const url = `${env.bibleApiBaseUrl}/${encodeURIComponent(`${slug} ${chapterId}`)}${query}`;

    let response: Response;
    try {
      response = await fetch(url, {
        next: { revalidate: 86400 },
      });
    } catch {
      throw new ExternalServiceError("Unable to reach the Bible text provider");
    }

    if (!response.ok) {
      throw new ExternalServiceError(
        `Bible text provider returned ${response.status}`,
      );
    }

    const payload = (await response.json()) as ExternalBibleChapterResponse;

    if (!payload.verses?.length) {
      throw new NotFoundError(
        `No verses found for ${book.book} chapter ${chapterId}`,
      );
    }

    const testament: Testament = book.testament;

    return {
      result: payload.verses.map((entry) => ({
        chapterId: entry.chapter,
        verseId: entry.verse,
        verse: entry.text.trim(),
        book: {
          name: book.book,
          testament,
        },
      })),
    };
  }
}
