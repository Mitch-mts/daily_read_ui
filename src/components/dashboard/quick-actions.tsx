"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Dices,
  Heart,
  History,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickAction {
  label: string;
  subtitle: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface QuickActionsProps {
  onRandomVerse: () => void;
  onReadBible: () => void;
  onFavorites: () => void;
  onHistory: () => void;
}

export function QuickActions({
  onRandomVerse,
  onReadBible,
  onFavorites,
  onHistory,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      label: "Random Verse",
      subtitle: "Discover something new",
      icon: Dices,
      onClick: onRandomVerse,
    },
    {
      label: "Read Bible",
      subtitle: "Open the reader",
      icon: BookOpen,
      onClick: onReadBible,
    },
    {
      label: "Favorites",
      subtitle: "Saved passages",
      icon: Heart,
      onClick: onFavorites,
    },
    {
      label: "History",
      subtitle: "Past readings",
      icon: History,
      onClick: onHistory,
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <button
              type="button"
              onClick={action.onClick}
              className="w-full text-left"
            >
              <Card className="h-full transition-shadow hover:shadow-glow">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{action.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {action.subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
