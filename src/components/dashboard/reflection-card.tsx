"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { REFLECTION_PROMPT } from "@/constants/quotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReflectionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PenLine className="h-4 w-4 text-primary" />
            Daily Reflection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {REFLECTION_PROMPT}
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              Journaling coming soon — capture your thoughts here.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
