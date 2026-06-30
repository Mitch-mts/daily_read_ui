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

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Read Bible", href: "#read", icon: BookOpen },
  { label: "Reading Plans", href: "#plans", icon: Calendar },
  { label: "Favorites", href: "#favorites", icon: Heart },
  { label: "Notes", href: "#notes", icon: NotebookPen },
  { label: "History", href: "#history", icon: History },
  { label: "Goals", href: "#goals", icon: Target },
  { label: "Settings", href: "#settings", icon: Settings },
];
