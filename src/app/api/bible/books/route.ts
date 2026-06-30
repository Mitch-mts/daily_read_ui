import { jsonError, jsonSuccess } from "@/lib/api-response";
import { BibleService } from "@/services/bible/BibleService";
import type { BooksResponse } from "@/types/bible";

export async function GET(): Promise<Response> {
  try {
    const body: BooksResponse = { books: BibleService.getBooks() };
    return jsonSuccess(body);
  } catch (error) {
    return jsonError(error);
  }
}

export const runtime = "nodejs";
