"use client";

import { Heart, Trash2 } from "lucide-react";
import type { FavoriteVerse } from "@/types/bible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FavoritesPanelProps {
  favorites: FavoriteVerse[];
  onOpen: (favorite: FavoriteVerse) => void;
  onRemove: (id: number) => void;
  onSaveCurrent?: () => void;
  canSaveCurrent?: boolean;
}

function formatReference(favorite: FavoriteVerse): string {
  return favorite.verseId !== undefined
    ? `${favorite.book} ${favorite.chapter}:${favorite.verseId}`
    : `${favorite.book} Chapter ${favorite.chapter}`;
}

export function FavoritesPanel({
  favorites,
  onOpen,
  onRemove,
  onSaveCurrent,
  canSaveCurrent,
}: FavoritesPanelProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Favorites</h1>
          <p className="mt-1 text-muted-foreground">
            Saved chapters and verses you want to revisit.
          </p>
        </div>
        {canSaveCurrent && onSaveCurrent && (
          <Button onClick={onSaveCurrent}>
            <Heart className="mr-2 h-4 w-4" />
            Save current reading
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-4 font-display text-lg">No favorites yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Bookmark a chapter or tap the heart on any verse while reading.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favorites.map((favorite) => {
            const preview = favorite.verse.slice(0, 2).join(" ");
            return (
              <Card key={favorite.id} className="transition-shadow hover:shadow-soft">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpen(favorite)}
                      className="text-left font-display text-lg font-semibold text-primary hover:underline"
                    >
                      {formatReference(favorite)}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(favorite.id)}
                      aria-label="Remove favorite"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{favorite.date}</p>
                </CardHeader>
                <CardContent>
                  <p className="font-scripture text-sm italic text-muted-foreground line-clamp-3">
                    {preview}
                    {favorite.verse.length > 2 ? "…" : ""}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => onOpen(favorite)}
                  >
                    Open reading
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
