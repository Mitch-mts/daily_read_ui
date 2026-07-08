import type { PlanProgress, ReadingPlan } from "@/types/dashboard";

const PLANS_KEY = "daily-reader-plan-progress";

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "gospel-30",
    title: "Gospel in 30 Days",
    description: "Walk through the life of Jesus with a chapter-a-day pace.",
    durationDays: 30,
    chaptersTotal: 30,
  },
  {
    id: "psalms-prayer",
    title: "Psalms for Prayer",
    description: "A month of Psalms to deepen worship and reflection.",
    durationDays: 30,
    chaptersTotal: 30,
  },
  {
    id: "proverbs-wisdom",
    title: "Proverbs Daily Wisdom",
    description: "One chapter of Proverbs each day for practical wisdom.",
    durationDays: 31,
    chaptersTotal: 31,
  },
  {
    id: "nt-journey",
    title: "New Testament Journey",
    description: "Read through the New Testament at a steady weekly rhythm.",
    durationDays: 90,
    chaptersTotal: 90,
  },
];

export function loadPlanProgress(): PlanProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    return raw ? (JSON.parse(raw) as PlanProgress[]) : [];
  } catch {
    return [];
  }
}

function savePlanProgress(progress: PlanProgress[]) {
  localStorage.setItem(PLANS_KEY, JSON.stringify(progress));
}

export function startPlan(planId: string): PlanProgress[] {
  const existing = loadPlanProgress();
  if (existing.some((p) => p.planId === planId)) return existing;

  const next: PlanProgress[] = [
    ...existing,
    {
      planId,
      startedAt: new Date().toISOString(),
      daysCompleted: 0,
    },
  ];
  savePlanProgress(next);
  return next;
}

export function markPlanDayComplete(planId: string): PlanProgress[] {
  const next = loadPlanProgress().map((p) =>
    p.planId === planId
      ? { ...p, daysCompleted: p.daysCompleted + 1 }
      : p,
  );
  savePlanProgress(next);
  return next;
}

export function getPlanById(planId: string): ReadingPlan | undefined {
  return READING_PLANS.find((p) => p.id === planId);
}
