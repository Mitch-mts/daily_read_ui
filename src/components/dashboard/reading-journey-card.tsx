"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { BookMarked, BookOpen, Flame, ScrollText } from "lucide-react";
import type { ReadingJourney } from "@/lib/readingJourney";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReadingJourneyCardProps {
  journey: ReadingJourney;
  booksReadCount: number;
  verseCount: number;
  progressPercent: number;
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildChartData(journey: ReadingJourney) {
  const today = new Date().getDay();
  return WEEK_DAYS.map((day, index) => ({
    day,
    chapters: index === today ? journey.chaptersReadWeek : Math.max(0, journey.chaptersReadWeek - (today - index)),
  }));
}

export function ReadingJourneyCard({
  journey,
  booksReadCount,
  verseCount,
  progressPercent,
}: ReadingJourneyCardProps) {
  const chartData = buildChartData(journey);

  const stats = [
    { label: "Streak", value: `${journey.streak} days`, icon: Flame },
    { label: "Books", value: booksReadCount, icon: BookMarked },
    { label: "Chapters", value: journey.chaptersReadWeek, icon: BookOpen },
    { label: "Verses", value: verseCount || "—", icon: ScrollText },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-card-gradient">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reading Journey</CardTitle>
            <Badge variant="gold">{progressPercent}% weekly goal</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-border/50 bg-background/60 p-3"
              >
                <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
                <p className="font-display text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Weekly progress</span>
              <span>{journey.chaptersReadWeek} / 7 chapters</span>
            </div>
            <Progress value={progressPercent} />
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorChapters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="chapters"
                  stroke="#6366f1"
                  fill="url(#colorChapters)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
