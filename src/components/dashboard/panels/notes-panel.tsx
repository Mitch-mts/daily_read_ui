"use client";

import { useState } from "react";
import { NotebookPen, Pencil, Trash2 } from "lucide-react";
import type { ReadingNote } from "@/types/dashboard";
import { formatNoteReference } from "@/lib/notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface NotesPanelProps {
  notes: ReadingNote[];
  currentReference?: string;
  onAdd: (text: string) => void;
  onUpdate: (id: number, text: string) => void;
  onRemove: (id: number) => void;
}

export function NotesPanel({
  notes,
  currentReference,
  onAdd,
  onUpdate,
  onRemove,
}: NotesPanelProps) {
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft("");
  };

  const startEdit = (note: ReadingNote) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (editingId === null || !editText.trim()) return;
    onUpdate(editingId, editText);
    setEditingId(null);
    setEditText("");
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Notes</h1>
        <p className="mt-1 text-muted-foreground">
          Reflections and observations tied to your reading.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          {currentReference && (
            <p className="text-sm text-muted-foreground">
              Adding note for <span className="font-medium text-foreground">{currentReference}</span>
            </p>
          )}
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a reflection, prayer, or takeaway…"
            rows={4}
            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <Button onClick={handleAdd} disabled={!draft.trim()}>
            <NotebookPen className="mr-2 h-4 w-4" />
            Save note
          </Button>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            No notes yet. Start writing while you read.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id}>
              <Card>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-primary">
                        {formatNoteReference(note)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(note)}
                        aria-label="Edit note"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(note.id)}
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {editingId === note.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{note.text}</p>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
