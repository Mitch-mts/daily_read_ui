"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopNavbarProps {
  greeting: string;
  dateLabel: string;
  onMenuClick?: () => void;
}

export function TopNavbar({ greeting, dateLabel, onMenuClick }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 lg:px-8 lg:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-display text-xl font-semibold md:text-2xl">
                {greeting}
              </h1>
              <p className="text-sm text-muted-foreground">{dateLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Avatar>
              <AvatarImage src="/images/read1.jpeg" alt="Mitch" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="relative max-w-md">
         
        </div>
      </div>
    </header>
  );
}
