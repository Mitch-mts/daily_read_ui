export interface DailyVerse {
  text: string;
  reference: string;
}

export const DAILY_VERSES: DailyVerse[] = [
  {
    text: "Your word is a lamp to my feet and a light to my path.",
    reference: "Psalm 119:105",
  },
  {
    text: "Be still, and know that I am God.",
    reference: "Psalm 46:10",
  },
  {
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
  },
  {
    text: "Trust in the Lord with all your heart.",
    reference: "Proverbs 3:5",
  },
  {
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
  },
  {
    text: "For God so loved the world, that he gave his only Son.",
    reference: "John 3:16",
  },
  {
    text: "The Lord is near to all who call on him.",
    reference: "Psalm 145:18",
  },
];

export function getVerseOfTheDay(): DailyVerse {
  const dayIndex = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
  return DAILY_VERSES[dayIndex % DAILY_VERSES.length];
}

export const INSPIRATION_QUOTE =
  "The Bible is the greatest of all books because it is the Word of God and contains the revelation of His character and will.";

export const REFLECTION_PROMPT =
  "What is one truth from today's reading that you want to carry into your day?";

export const PRAYER_PROMPT =
  "Lord, open my heart to receive Your Word. Guide my thoughts, renew my spirit, and help me walk in Your wisdom today. Amen.";
