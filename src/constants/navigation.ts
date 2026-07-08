import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calendar,
  Heart,
  History,
  Home,
  NotebookPen,
  Settings,
  Target,
} from "lucide-react";
import type { NavSection } from "@/types/dashboard";

export type { NavSection };

export interface NavItem {
  label: string;
  icon: LucideIcon;
  section: NavSection;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Home", icon: Home, section: "home" },
  { label: "Read Bible", icon: BookOpen, section: "read" },
  { label: "Reading Plans", icon: Calendar, section: "plans" },
  { label: "Favorites", icon: Heart, section: "favorites" },
  { label: "Notes", icon: NotebookPen, section: "notes" },
  { label: "History", icon: History, section: "history" },
  { label: "Goals", icon: Target, section: "goals" },
  { label: "Settings", icon: Settings, section: "settings" },
];
