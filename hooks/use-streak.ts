"use client";

import { useCallback, useMemo, useState } from "react";

const LAST_STUDY_KEY = "flashcard-ai:last-study-date";
const STREAK_KEY = "flashcard-ai:study-streak";

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const dayDiff = (from: string, to: string) => {
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T00:00:00.000Z`);
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000);
};

export function useStreak() {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return { streak: 0, lastStudyDate: null as string | null };
    }

    const storedStreak = Number(localStorage.getItem(STREAK_KEY) ?? "0");
    const storedLastDate = localStorage.getItem(LAST_STUDY_KEY);

    if (storedLastDate) {
      const today = toDateKey(new Date());
      const diff = dayDiff(storedLastDate, today);

      if (diff > 1) {
        localStorage.setItem(STREAK_KEY, "0");
        return { streak: 0, lastStudyDate: storedLastDate };
      }

      return {
        streak: Number.isNaN(storedStreak) ? 0 : storedStreak,
        lastStudyDate: storedLastDate,
      };
    }

    return {
      streak: Number.isNaN(storedStreak) ? 0 : storedStreak,
      lastStudyDate: null as string | null,
    };
  });

  const streak = state.streak;
  const lastStudyDate = state.lastStudyDate;

  const markStudiedToday = useCallback(() => {
    const today = toDateKey(new Date());
    const prevDate = localStorage.getItem(LAST_STUDY_KEY);
    const prevStreak = Number(localStorage.getItem(STREAK_KEY) ?? "0");
    const safePrevStreak = Number.isNaN(prevStreak) ? 0 : prevStreak;

    if (prevDate === today) {
      return safePrevStreak;
    }

    const diff = prevDate ? dayDiff(prevDate, today) : Number.POSITIVE_INFINITY;
    const nextStreak = diff === 1 ? safePrevStreak + 1 : 1;

    localStorage.setItem(LAST_STUDY_KEY, today);
    localStorage.setItem(STREAK_KEY, String(nextStreak));
    setState({ streak: nextStreak, lastStudyDate: today });
    return nextStreak;
  }, []);

  const streakLabel = useMemo(() => {
    if (streak <= 0) return "No streak yet";
    if (streak === 1) return "1 day streak";
    return `${streak} day streak`;
  }, [streak]);

  return {
    streak,
    streakLabel,
    lastStudyDate,
    markStudiedToday,
  };
}

