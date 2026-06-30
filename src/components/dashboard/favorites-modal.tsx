import type { FavoriteVerse } from "@/types/bible";
import type { ModalState } from "@/hooks/useReadingSession";
import { Button } from "@/components/ui/button";

interface FavoritesModalProps {
  modal: ModalState;
  favorites: FavoriteVerse[];
  expandedId: number | null;
  onExpand: (id: number | null) => void;
  onOpen: (favorite: FavoriteVerse) => void;
  onRemove: (id: number) => void;
  onClose: () => void;
}

export function FavoritesModal({
  modal,
  favorites,
  expandedId,
  onExpand,
  onOpen,
  onRemove,
  onClose,
}: FavoritesModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h4 id="modal-title" className="font-display text-xl font-bold">
          {modal.title}
        </h4>
        <p className="mt-2 text-sm text-muted-foreground">{modal.message}</p>

        {modal.mode === "favorites" && (
          <ul className="mt-4 space-y-3">
            {favorites.map((favorite) => {
              const isExpanded = expandedId === favorite.id;
              const preview = favorite.verse.slice(0, 3).join(" ");
              const fullText = favorite.verse.join(" ");

              return (
                <li
                  key={favorite.id}
                  className="rounded-xl border border-border bg-muted/30 p-4 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpen(favorite)}
                      className="text-left font-semibold text-primary hover:underline"
                    >
                      {favorite.book} Chapter {favorite.chapter}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(favorite.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{favorite.date}</p>
                  <p className="mt-2 font-scripture italic text-muted-foreground">
                    {isExpanded ? fullText : preview}
                    {!isExpanded && favorite.verse.length > 3 ? "…" : ""}
                  </p>
                  {favorite.verse.length > 3 && (
                    <button
                      type="button"
                      onClick={() => onExpand(isExpanded ? null : favorite.id)}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <Button className="mt-6 w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
