"use client";

import { Calendar, CheckCircle2, Play } from "lucide-react";
import type { PlanProgress } from "@/types/dashboard";
import { READING_PLANS } from "@/lib/readingPlans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReadingPlansPanelProps {
  planProgress: PlanProgress[];
  onStart: (planId: string) => void;
  onMarkDay: (planId: string) => void;
}

export function ReadingPlansPanel({
  planProgress,
  onStart,
  onMarkDay,
}: ReadingPlansPanelProps) {
  const getProgress = (planId: string) =>
    planProgress.find((p) => p.planId === planId);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Reading Plans</h1>
        <p className="mt-1 text-muted-foreground">
          Guided journeys to help you read Scripture consistently.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {READING_PLANS.map((plan) => {
          const progress = getProgress(plan.id);
          const percent = progress
            ? Math.min(100, Math.round((progress.daysCompleted / plan.durationDays) * 100))
            : 0;
          const isActive = !!progress;
          const isComplete = progress
            ? progress.daysCompleted >= plan.durationDays
            : false;

          return (
            <Card key={plan.id} className="transition-shadow hover:shadow-soft">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-xl">{plan.title}</CardTitle>
                  {isComplete ? (
                    <Badge variant="gold">Complete</Badge>
                  ) : isActive ? (
                    <Badge>Active</Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {plan.durationDays} days · {plan.chaptersTotal} chapters
                </div>

                {isActive && (
                  <div className="space-y-2">
                    <Progress value={percent} className="h-2" />
                    <p className="text-sm">
                      Day {progress!.daysCompleted} of {plan.durationDays}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {!isActive && (
                    <Button onClick={() => onStart(plan.id)}>
                      <Play className="mr-2 h-4 w-4" />
                      Start plan
                    </Button>
                  )}
                  {isActive && !isComplete && (
                    <Button onClick={() => onMarkDay(plan.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark day complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
