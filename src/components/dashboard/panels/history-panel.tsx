"use client";

import { Clock, Trash2 } from "lucide-react";
import type { ReadingHistoryEntry } from "@/types/dashboard";
import {
  formatHistoryReference,
  formatHistoryTime,
} from "@/lib/history";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HistoryPanelProps {
  history: ReadingHistoryEntry[];
  onOpen: (entry: ReadingHistoryEntry) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onOpen, onClear }: HistoryPanelProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">History</h1>
          <p className="mt-1 text-muted-foreground">
            Recently opened passages for quick return.
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" onClick={onClear}>
            Clear history
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Clock className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-4 font-display text-lg">No reading history yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Open a chapter or verse and it will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {history.map((entry) => (
            <li key={entry.id}>
              <Card className="transition-shadow hover:shadow-soft">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpen(entry)}
                      className="font-semibold text-primary hover:underline"
                    >
                      {formatHistoryReference(entry)}
                    </button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatHistoryTime(entry.openedAt)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onOpen(entry)}>
                    Reopen
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
