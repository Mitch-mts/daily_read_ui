import { AppError } from "@/utils/errors";

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  bibleApiBaseUrl:
    process.env.BIBLE_API_BASE_URL ?? "https://bible-api.com",
  bibleTranslation: process.env.BIBLE_TRANSLATION ?? "",
  databaseUrl: process.env.DATABASE_URL,
  openAiApiKey: process.env.OPENAI_API_KEY,
} as const;

export function assertEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new AppError(`Missing required environment variable: ${name}`, 500, "CONFIG_ERROR");
  }
  return value;
}
