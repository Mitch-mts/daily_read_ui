"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PRAYER_PROMPT } from "@/constants/quotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrayerCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="h-4 w-4 text-amber-600" />
            Prayer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-scripture text-sm italic leading-relaxed text-foreground/80">
            {PRAYER_PROMPT}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
