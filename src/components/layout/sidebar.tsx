"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sparkles, Sun } from "lucide-react";
import { MAIN_NAV, type NavItem } from "@/constants/navigation";
import { DAILY_VERSES, getVerseOfTheDay, type DailyVerse } from "@/constants/quotes";
import type { ReadingJourney } from "@/lib/readingJourney";
import type { NavSection } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SidebarProps {
  journey: ReadingJourney;
  progressPercent: number;
  activeSection: NavSection;
  onNavClick?: (item: NavItem) => void;
  className?: string;
}

export function Sidebar({
  activeSection,
  onNavClick,
  className,
}: SidebarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [verse, setVerse] = useState<DailyVerse>(DAILY_VERSES[0]);
  const floatAreaRef = useRef<HTMLDivElement>(null);
  const verseCardRef = useRef<HTMLDivElement>(null);
  const [travelDistance, setTravelDistance] = useState(0);

  useEffect(() => {
    setMounted(true);
    setVerse(getVerseOfTheDay());
  }, []);

  useEffect(() => {
    const area = floatAreaRef.current;
    const card = verseCardRef.current;
    if (!area || !card) return;

    const updateTravel = () => {
      const available = area.clientHeight - card.offsetHeight;
      setTravelDistance(Math.max(0, available - 8));
    };

    updateTravel();

    const observer = new ResizeObserver(updateTravel);
    observer.observe(area);
    observer.observe(card);

    return () => observer.disconnect();
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

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

      <nav className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="shrink-0 space-y-1">
          {MAIN_NAV.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onNavClick?.(item);
                }}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                  activeSection === item.section
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
              </button>
            </motion.div>
          ))}
        </div>

        <div
          ref={floatAreaRef}
          className="relative mt-4 min-h-[140px] flex-1 overflow-hidden"
        >
          <motion.div
            ref={verseCardRef}
            className="absolute bottom-0 left-0 right-0"
            animate={
              travelDistance > 0
                ? { y: [0, -travelDistance, 0] }
                : { y: 0 }
            }
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
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
                <p className="mt-2 text-xs font-medium text-primary">
                  {verse.reference}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </nav>

      <div className="space-y-3 border-t border-border/60 p-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          <span className="flex items-center gap-2">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Light mode" : "Dark mode"}
          </span>
        </Button>
      </div>
    </aside>
  );
}
