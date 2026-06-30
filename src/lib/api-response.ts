import { NextResponse } from "next/server";
import { AppError } from "@/utils/errors";

export function jsonSuccess<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function jsonError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.code,
        message: error.message,
        statusCode: error.statusCode,
      },
      { status: error.statusCode },
    );
  }

  console.error("[API] Unexpected error:", error);

  return NextResponse.json(
    {
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      statusCode: 500,
    },
    { status: 500 },
  );
}
