"use client";

import { motion } from "framer-motion";
import { Cross } from "lucide-react";
import { INSPIRATION_QUOTE } from "@/constants/quotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InspirationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-glow">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Cross className="h-5 w-5 text-gold-light" />
            Today&apos;s Inspiration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="font-scripture text-lg italic leading-relaxed text-white/95">
            &ldquo;{INSPIRATION_QUOTE}&rdquo;
          </blockquote>
        </CardContent>
      </Card>
    </motion.div>
  );
}
