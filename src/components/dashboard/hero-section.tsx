"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { DAILY_VERSES, getVerseOfTheDay, type DailyVerse } from "@/constants/quotes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeroSectionProps {
  onStartReading: () => void;
  onContinueReading: () => void;
  hasLastReading: boolean;
}

export function HeroSection({
  onStartReading,
  onContinueReading,
  hasLastReading,
}: HeroSectionProps) {
  const [verse, setVerse] = useState<DailyVerse>(DAILY_VERSES[0]);
  const [today, setToday] = useState("Today");

  useEffect(() => {
    setVerse(getVerseOfTheDay());
    setToday(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  return (
    <section id="home" className="relative overflow-hidden rounded-3xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/header.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-hero-overlay" aria-hidden />

      <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:p-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/70">
            Scripture · Peace · Purpose
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Welcome to your daily journey through Scripture
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
            Let God&apos;s Word guide your heart today and always.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={onStartReading} className="shadow-glow">
              <BookOpen className="h-4 w-4" />
              Start Reading
            </Button>
            {hasLastReading && (
              <Button size="lg" variant="glass" onClick={onContinueReading}>
                Continue Reading
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center justify-center md:justify-end"
        >
          <Card className="glass w-full max-w-sm animate-float border-white/25 bg-white/15 text-white shadow-glass backdrop-blur-2xl">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Sparkles className="h-5 w-5 text-gold-light" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Verse of the Day
                    </p>
                    <p className="text-sm text-white/90">{today}</p>
                  </div>
                </div>
              </div>
              <blockquote className="font-scripture text-lg italic leading-relaxed text-white">
                &ldquo;{verse.text}&rdquo;
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-gold-light">
                — {verse.reference}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
