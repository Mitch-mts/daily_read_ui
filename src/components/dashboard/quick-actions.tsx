"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  Calendar,
  Dices,
  Heart,
  History,
  NotebookPen,
  Search,
  Share2,
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
  onFavorites: () => void;
  onComingSoon: (feature: string) => void;
}

export function QuickActions({
  onRandomVerse,
  onFavorites,
  onComingSoon,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      label: "Random Verse",
      subtitle: "Discover something new",
      icon: Dices,
      onClick: onRandomVerse,
    },
    {
      label: "Reading Plans",
      subtitle: "Structured journeys",
      icon: Calendar,
      onClick: () => onComingSoon("Reading Plans"),
    },
    {
      label: "Prayer Journal",
      subtitle: "Record your prayers",
      icon: Heart,
      onClick: () => onComingSoon("Prayer Journal"),
    },
    {
      label: "Bookmarks",
      subtitle: "Saved passages",
      icon: Bookmark,
      onClick: onFavorites,
    },
    {
      label: "Notes",
      subtitle: "Your reflections",
      icon: NotebookPen,
      onClick: () => onComingSoon("Notes"),
    },
    {
      label: "Search Bible",
      subtitle: "Find any verse",
      icon: Search,
      onClick: () => onComingSoon("Search Bible"),
    },
    {
      label: "Share Verse",
      subtitle: "Spread the Word",
      icon: Share2,
      onClick: () => onComingSoon("Share Verse"),
    },
    {
      label: "History",
      subtitle: "Past readings",
      icon: History,
      onClick: () => onComingSoon("History"),
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
