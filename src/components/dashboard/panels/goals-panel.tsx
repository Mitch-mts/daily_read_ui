"use client";

import { BookOpen, CheckCircle2, Flame, Target } from "lucide-react";
import type { ReadingJourney } from "@/lib/readingJourney";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GoalsPanelProps {
  journey: ReadingJourney;
  progressPercent: number;
  booksReadCount: number;
}

export function GoalsPanel({
  journey,
  progressPercent,
  booksReadCount,
}: GoalsPanelProps) {
  const weeklyTarget = 7;
  const weeklyProgress = Math.min(
    100,
    Math.round((journey.chaptersReadWeek / weeklyTarget) * 100),
  );

  const milestones = [
    {
      label: "Daily streak",
      value: `${journey.streak} day${journey.streak === 1 ? "" : "s"}`,
      icon: Flame,
      done: journey.streak >= 3,
    },
    {
      label: "Weekly chapters",
      value: `${journey.chaptersReadWeek} / ${weeklyTarget}`,
      icon: BookOpen,
      done: journey.chaptersReadWeek >= weeklyTarget,
    },
    {
      label: "Books explored",
      value: String(booksReadCount),
      icon: Target,
      done: booksReadCount >= 3,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Goals</h1>
        <p className="mt-1 text-muted-foreground">
          Track your reading rhythm and weekly progress.
        </p>
      </div>

      <Card className="bg-card-gradient">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly target</CardTitle>
            <Badge variant="gold">{progressPercent}%</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Read {weeklyTarget} chapters this week to hit your goal.
          </p>
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-sm font-medium">
            {journey.chaptersReadWeek} of {weeklyTarget} chapters completed
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {milestones.map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-xl font-semibold">{item.value}</p>
                {item.done && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Milestone reached
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
