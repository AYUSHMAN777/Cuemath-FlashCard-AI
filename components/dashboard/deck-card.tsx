"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, Eye, Library, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type DeckCardData = {
  id: string;
  title: string;
  totalCards: number;
  dueCards: number;
};

type DeckCardProps = {
  deck: DeckCardData;
};

export function DeckCard({ deck }: DeckCardProps) {
  const progress = deck.totalCards > 0 ? Math.round(((deck.totalCards - deck.dueCards) / deck.totalCards) * 100) : 0;

  return (
    <motion.div variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}>
      <div className="group relative rounded-3xl bg-gradient-to-r from-violet-500/20 via-sky-400/15 to-emerald-400/15 p-[1px]">
        <div className="rounded-3xl bg-white/80 shadow-sm backdrop-blur transition-shadow group-hover:shadow-md dark:bg-black/40">
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
            <Card className="rounded-3xl bg-transparent ring-0 shadow-none">
              <CardHeader className="gap-1">
                <CardTitle className="line-clamp-2 break-words text-base font-semibold text-zinc-900 dark:text-white">
                  {deck.title}
                </CardTitle>
                <CardDescription>
                  {deck.dueCards > 0 ? `${deck.dueCards} due today` : "All caught up"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Library className="size-3.5" /> {deck.totalCards} cards
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="size-3.5" /> {deck.dueCards} due
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-2 sm:flex-row">
                <Button asChild variant="outline" className="w-full flex-1 rounded-2xl">
                  <Link href={`/deck/${deck.id}`}>
                    <Eye className="mr-2 size-4" />
                    View
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full flex-1 rounded-2xl bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95"
                >
                  <Link href={`/practice/${deck.id}`}>
                    <Play className="mr-2 size-4" />
                    Practice
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

