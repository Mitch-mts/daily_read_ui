"use client";

import { useTheme } from "next-themes";
import { Minus, Moon, Plus, Sun } from "lucide-react";
import type { ReadingMode } from "@/types/bible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsPanelProps {
  readingMode: ReadingMode;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
}

const MODE_LABELS: Record<ReadingMode, string> = {
  normal: "Normal",
  large: "Large",
  "extra-large": "Extra large",
};

export function SettingsPanel({
  readingMode,
  onIncreaseFont,
  onDecreaseFont,
}: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Personalize your reading experience.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark mode
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">Font size</p>
              <p className="text-sm text-muted-foreground">
                Current: {MODE_LABELS[readingMode]}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={onDecreaseFont} aria-label="Decrease font">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onIncreaseFont} aria-label="Increase font">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
