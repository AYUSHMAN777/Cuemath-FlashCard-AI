"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Flame,
  Layers3,
  Library,
  Play,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeckCard, type DeckCardData } from "@/components/dashboard/deck-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { useStreak } from "@/hooks/use-streak";

export type DashboardDeck = {
  id: string;
  title: string;
  totalCards: number;
  dueCards: number;
};

export type DashboardStats = {
  totalDecks: number;
  totalCards: number;
  dueToday: number;
};

type DashboardClientProps = {
  stats: DashboardStats;
  decks: DashboardDeck[];
};

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export function DashboardClient({ stats, decks }: DashboardClientProps) {
  const { streak, streakLabel, markStudiedToday } = useStreak();
  const deckCards: DeckCardData[] = decks;
  const dueDecks = deckCards.filter((d) => d.dueCards > 0).sort((a, b) => b.dueCards - a.dueCards);
  const nextDeckForReview = dueDecks[0] ?? deckCards[0];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <motion.header
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.06 }}
        className="flex flex-col gap-5"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-5 rounded-[2rem] border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/30 dark:text-violet-200">
              <Flame className="size-3.5" />
              Study dashboard
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Your study system at a glance—decks, cards, and what’s due today.
            </p>
          </div>

          <Button
            asChild
            className="h-10 w-full bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-95 sm:w-auto"
          >
            <Link href="/upload">
              <Plus className="mr-0 size-4" />
              New deck
            </Link>
          </Button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            label="Total decks"
            value={String(stats.totalDecks)}
            icon={<Library className="size-4 text-violet-700 dark:text-violet-300" />}
            accentClassName="bg-violet-500/10"
          />
          <StatCard
            label="Total cards"
            value={String(stats.totalCards)}
            icon={<Layers3 className="size-4 text-sky-700 dark:text-sky-300" />}
            accentClassName="bg-sky-500/10"
          />
          <StatCard
            label="Due today"
            value={String(stats.dueToday)}
            icon={<CalendarClock className="size-4 text-emerald-700 dark:text-emerald-300" />}
            accentClassName="bg-emerald-500/10"
          />
          <StatCard
            label="Study streak"
            value={String(streak)}
            hint={streakLabel}
            icon={<Flame className="size-4 text-orange-700 dark:text-orange-300" />}
            accentClassName="bg-orange-500/10"
          />
        </motion.div>
      </motion.header>

      <motion.section
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.06, delayChildren: 0.05 }}
        className="grid gap-4 lg:grid-cols-[1.2fr_1fr]"
        aria-label="Due today"
      >
        <motion.div variants={fadeUp}>
          <div className="group relative rounded-3xl bg-gradient-to-r from-violet-500/20 via-sky-400/15 to-emerald-400/15 p-[1px]">
            <div className="rounded-3xl bg-white/80 shadow-sm backdrop-blur transition-shadow group-hover:shadow-md dark:bg-black/40">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Card className="rounded-3xl bg-transparent ring-0 shadow-none">
                  <CardHeader className="gap-2">
                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
                      Due today
                    </CardTitle>
                    <CardDescription className="leading-6">
                      {stats.dueToday > 0
                        ? "Knock out your reviews and keep momentum."
                        : "You’re all caught up. Create a new deck or review for extra practice."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end gap-2">
                      <div className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                        {stats.dueToday}
                      </div>
                      <div className="pb-1 text-sm text-zinc-600 dark:text-zinc-300">cards</div>
                    </div>
                    {dueDecks.length > 0 ? (
                      <div className="space-y-2">
                        {dueDecks.slice(0, 3).map((deck) => (
                          <div
                            key={deck.id}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/70 px-3 py-3 text-sm dark:border-white/10 dark:bg-black/40"
                          >
                            <span className="min-w-0 flex-1 line-clamp-2 break-words text-zinc-900 dark:text-white">
                              {deck.title}
                            </span>
                            <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                              {deck.dueCards} due
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4 border-t border-black/5 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                      {dueDecks.length > 0
                        ? "Top due decks are listed. Start with the highest due count."
                        : "No cards due now. Great consistency."}
                    </div>
                    <Button
                      asChild
                      className="h-9 w-full bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95 sm:w-auto"
                    >
                      <Link
                        href={nextDeckForReview ? `/practice/${nextDeckForReview.id}` : "/upload"}
                        onClick={markStudiedToday}
                      >
                        Start review <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="group relative rounded-3xl bg-gradient-to-r from-violet-500/20 via-sky-400/15 to-emerald-400/15 p-[1px]">
            <div className="rounded-3xl bg-white/80 shadow-sm backdrop-blur transition-shadow group-hover:shadow-md dark:bg-black/40">
              <Card className="rounded-3xl bg-transparent ring-0 shadow-none">
                <CardHeader className="gap-2">
                  <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Quick actions
                  </CardTitle>
                  <CardDescription className="leading-6">Jump into the flow in one click.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Button asChild variant="outline" className="h-auto justify-between rounded-2xl py-3 whitespace-normal">
                    <Link href="/upload">
                      <span className="flex items-center gap-2">
                        <Plus className="size-4" /> Create a new deck
                      </span>
                      <ArrowRight className="size-4 opacity-60" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto justify-between rounded-2xl py-3 whitespace-normal">
                    <Link href={decks[0] ? `/practice/${decks[0].id}` : "/upload"}>
                      <span className="flex items-center gap-2">
                        <Play className="size-4" /> Practice latest deck
                      </span>
                      <ArrowRight className="size-4 opacity-60" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto justify-between rounded-2xl py-3 whitespace-normal">
                    <Link href="/dashboard" onClick={markStudiedToday}>
                      <span className="flex items-center gap-2">
                        <Flame className="size-4" /> Mark study done today
                      </span>
                      <ArrowRight className="size-4 opacity-60" />
                    </Link>
                  </Button>
                </CardContent>
                <CardFooter className="border-t border-black/5 pt-5 dark:border-white/10">
                  <div className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                    Keep it simple: upload → generate → review.
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.04 }}
        aria-label="Decks"
      >
        <motion.div variants={fadeUp} className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">Your decks</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              View a deck or jump straight into practice.
            </p>
          </div>
        </motion.div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deckCards.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white/70 p-10 text-sm text-zinc-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-300">
              <p className="text-base font-medium text-zinc-900 dark:text-white">No decks yet</p>
              <p className="mt-1">Create your first deck to unlock progress tracking and due reminders.</p>
              <div className="mt-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95"
                >
                  <Link href="/upload">
                    <Plus className="mr-2 size-4" />
                    Create your first deck
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            deckCards.map((deck) => <DeckCard key={deck.id} deck={deck} />)
          )}
        </div>
      </motion.section>
    </main>
  );
}

