"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_NAME = "Friend";

interface NamePromptModalProps {
  onSubmit: (name: string) => void;
}

export function NamePromptModal({ onSubmit }: NamePromptModalProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(value.trim() || DEFAULT_NAME);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-prompt-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>

        <h2
          id="name-prompt-title"
          className="font-display text-2xl font-semibold"
        >
          Welcome to Daily Bible Reader
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Let&apos;s make this space yours. What should we call you?
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter your name"
            aria-label="Your name"
            maxLength={40}
          />
          <Button type="submit" size="lg" className="w-full">
            Continue
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => onSubmit(DEFAULT_NAME)}
          >
            Skip for now
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground/80">
          Saved on this device only. You can change it anytime. If you skip,
          we&apos;ll simply call you {DEFAULT_NAME}.
        </p>
      </motion.div>
    </div>
  );
}
