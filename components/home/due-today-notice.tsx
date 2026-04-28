"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowUp, CheckCircle2, Flame } from "lucide-react";

type DueTodayResponse = {
  dueCount?: number;
  error?: string;
};

export function DueTodayNotice() {
  const { isLoaded, isSignedIn } = useUser();
  const [dueCount, setDueCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let isMounted = true;
    void fetch("/api/due-today")
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as DueTodayResponse;
      })
      .then((data) => {
        if (!isMounted || !data) return;
        setDueCount(typeof data.dueCount === "number" ? data.dueCount : 0);
      })
      .catch(() => {
        if (!isMounted) return;
        setDueCount(0);
      });

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn || dueCount === null) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 w-[min(23rem,calc(100vw-2rem))]">
      <div className="pointer-events-auto rounded-2xl border border-black/10 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-black/75">
        {dueCount > 0 ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  <span className="mr-1">🔥</span>
                  You have {dueCount} cards due today
                </p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  Stay on track before today ends.
                </p>
              </div>
              <ArrowUp className="size-5 animate-bounce text-violet-600 dark:text-violet-300" />
            </div>

            <Link
              href="/dashboard"
              className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 px-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">No due cards left today</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">You are all caught up. Great consistency.</p>
            </div>
          </div>
        )}
      </div>

      {dueCount > 0 ? (
        <div className="mr-6 mt-1 flex justify-end">
          <div className="rounded-full bg-violet-100/80 p-1 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
            <Flame className="size-3.5" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
