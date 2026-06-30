"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  BookOpen,
  Flame,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { MAIN_NAV } from "@/constants/navigation";
import { getVerseOfTheDay } from "@/constants/quotes";
import type { ReadingJourney } from "@/lib/readingJourney";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SidebarProps {
  journey: ReadingJourney;
  progressPercent: number;
  onNavClick?: (href: string) => void;
  className?: string;
}

export function Sidebar({ journey, progressPercent, onNavClick, className }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const verse = getVerseOfTheDay();

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col border-r border-border/60 bg-card/80 backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-border/60 p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-2 ring-primary/20">
            <Image
              src="/images/read1.jpeg"
              alt="Daily Bible Reader"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-tight">
              Daily Bible
            </p>
            <p className="text-xs text-muted-foreground">Reader</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {MAIN_NAV.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <a
              href={item.href}
              onClick={() => onNavClick?.(item.href)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          </motion.div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-border/60 p-4">
        <Card className="border-primary/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Streak
              </span>
            </div>
            <p className="font-display text-2xl font-bold">{journey.streak} days</p>
            <p className="mt-1 text-xs text-muted-foreground">Keep the flame alive</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Verse of the Day
              </span>
            </div>
            <p className="font-scripture text-sm italic leading-relaxed text-foreground/90">
              &ldquo;{verse.text}&rdquo;
            </p>
            <p className="mt-2 text-xs font-medium text-primary">{verse.reference}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Progress
                </span>
              </div>
              <Badge variant="gold">{progressPercent}%</Badge>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              {journey.chaptersReadWeek} chapters this week
            </p>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </Button>
      </div>
    </aside>
  );
}
