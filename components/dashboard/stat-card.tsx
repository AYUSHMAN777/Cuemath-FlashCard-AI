"use client";

import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  accentClassName: string;
};

export function StatCard({ label, value, hint = "Updated just now", icon, accentClassName }: StatCardProps) {
  return (
    <motion.div variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}>
      <div className="group relative h-full rounded-3xl bg-gradient-to-r from-violet-500/20 via-sky-400/15 to-emerald-400/15 p-[1px]">
        <div className="h-full rounded-3xl bg-white/80 shadow-sm backdrop-blur transition-shadow group-hover:shadow-md dark:bg-black/40">
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="h-full">
            <Card className="h-full rounded-3xl bg-transparent ring-0 shadow-none">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-zinc-900 dark:text-white">
                  <span>{label}</span>
                  <span className={cn("grid size-9 place-items-center rounded-2xl", accentClassName)}>
                    {icon}
                  </span>
                </CardTitle>
                <CardDescription className="sr-only">{label}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">{value}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{hint}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

