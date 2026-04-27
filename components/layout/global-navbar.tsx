"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import { MarketingAuthButtons } from "@/components/marketing/marketing-auth-buttons";
import { StreakBadge } from "@/components/streak/streak-badge";

export function GlobalNavbar() {
  const pathname = usePathname();

  // Homepage already renders its own marketing navbar.
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 text-white shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Flashcard AI</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-white">
            Dashboard
          </Link>
          <Link href="/upload" className="hover:text-zinc-900 dark:hover:text-white">
            Upload
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <StreakBadge />
          <MarketingAuthButtons />
        </div>
      </div>
    </header>
  );
}

