import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { BibleService } from "@/services/bible/BibleService";
import type { ChapterResponse } from "@/types/bible";

interface RouteContext {
  params: Promise<{ bookId: string; chapterId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  try {
    const { bookId, chapterId } = await context.params;
    const verse = request.nextUrl.searchParams.get("verse");
    const chapter: ChapterResponse = await BibleService.getChapter(
      bookId,
      chapterId,
      verse,
    );
    return jsonSuccess(chapter);
  } catch (error) {
    return jsonError(error);
  }
}

export const runtime = "nodejs";
