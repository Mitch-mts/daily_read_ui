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
  comingSoon?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Read Bible", href: "#read", icon: BookOpen },
  { label: "Reading Plans", href: "#plans", icon: Calendar, comingSoon: true },
  { label: "Favorites", href: "#favorites", icon: Heart },
  { label: "Notes", href: "#notes", icon: NotebookPen, comingSoon: true },
  { label: "History", href: "#history", icon: History, comingSoon: true },
  { label: "Goals", href: "#goals", icon: Target, comingSoon: true },
  { label: "Settings", href: "#settings", icon: Settings, comingSoon: true },
];
