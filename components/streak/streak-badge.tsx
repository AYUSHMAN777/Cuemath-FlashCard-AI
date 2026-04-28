"use client";

import { Flame } from "lucide-react";

import { useStreak } from "@/hooks/use-streak";

export function StreakBadge() {
  const { streak, streakLabel } = useStreak();

  return (
    <div
      title={streakLabel}
      className="hidden items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 shadow-sm dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-300 sm:inline-flex"
    >
      <Flame className="size-3.5" />
      <span>{streak}</span>
    </div>
  );
}

