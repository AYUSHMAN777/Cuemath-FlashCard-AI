 "use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Clock3, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DueTodayNotice } from "@/components/home/due-today-notice";
import { MarketingAuthButtons } from "@/components/marketing/marketing-auth-buttons";
import { StreakBadge } from "@/components/streak/streak-badge";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how", label: "How it works" },
    { href: "#pricing", label: "Get Started" },
  ];

  return (
    <div className="flex-1">
      <DueTodayNotice />
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="min-w-0 flex items-center gap-2">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 text-white shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <span className="truncate text-sm font-semibold tracking-tight">Cuemath FlashCard AI</span>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <nav className="flex items-center gap-8 text-sm text-zinc-600 dark:text-zinc-300">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-zinc-900 dark:hover:text-white">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <StreakBadge />
            <MarketingAuthButtons />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-black/5 bg-white/95 px-4 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/90 md:hidden">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[55rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/25 via-sky-400/20 to-emerald-400/15 blur-3xl" />
            <div className="absolute bottom-[-14rem] left-1/2 h-[28rem] w-[55rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-300/10 via-fuchsia-400/15 to-violet-500/15 blur-3xl" />
          </div>

          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-200">
                <span className="font-medium">New</span>
                <span className="text-zinc-500 dark:text-zinc-400">Turn PDFs into recall-ready decks</span>
              </div>

              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
                Study faster with{" "}
                <span className="bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  AI flashcards
                </span>{" "}
                
              </h1>

              <p className="mt-5 text-pretty text-base text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Upload notes, generate high-quality cards, and review with an algorithm that adapts to you. Clean UX,
                consistent progress, and premium-level polish.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-11 px-6 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white shadow-sm hover:-translate-y-px hover:opacity-95"
                >
                  <Link href="/upload">
                    Create your deck <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 px-6">
                  <a href="#features">See features</a>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm backdrop-blur transition-transform hover:scale-[1.01] dark:border-white/10 dark:bg-black/40">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                    <Brain className="size-4 text-violet-600 dark:text-violet-400" />
                    Smart generation
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    Create cards with clean questions and accurate answers.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm backdrop-blur transition-transform hover:scale-[1.01] dark:border-white/10 dark:bg-black/40">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                    <Clock3 className="size-4 text-sky-600 dark:text-sky-400" />
                    Adaptive reviews
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    Review cadence adjusts based on how well you recall.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm backdrop-blur transition-transform hover:scale-[1.01] dark:border-white/10 dark:bg-black/40">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                    <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
                    Premium UX
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    Minimal, elegant UI with polished interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                Everything you need to learn consistently
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
                Built for speed, clarity, and long-term retention—without clutter.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="group rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-black/40">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                <span className="grid size-9 place-items-center rounded-2xl bg-violet-500/10 text-violet-700 dark:text-violet-300">
                  <Brain className="size-4" />
                </span>
                AI that stays on-topic
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                Generates crisp Q/A cards from your content with less noise and more signal.
              </p>
            </div>

            <div className="group rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-black/40">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                <span className="grid size-9 place-items-center rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
                  <Clock3 className="size-4" />
                </span>
                Spaced repetition reviews
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                Rate your recall and let the schedule adapt—so you review what matters.
              </p>
            </div>

            <div className="group rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-black/40">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
                <span className="grid size-9 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="size-4" />
                </span>
                Focus-first design
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                A clean interface inspired by modern SaaS—soft shadows, rounded cards, and fast flows.
              </p>
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                How it works
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
                A simple workflow that feels premium from the first click.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "Upload your source",
                  description: "PDFs, notes, or docs—bring your study material in.",
                },
                {
                  title: "Generate a deck",
                  description: "AI produces clean, high-signal flashcards in seconds.",
                },
                {
                  title: "Review and improve",
                  description: "Rate your recall and let spaced repetition do the scheduling.",
                },
              ].map((step, idx) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-black/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 text-sm font-semibold text-white shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">{step.title}</div>
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{step.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
          aria-label="Premium call to action"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black/40 sm:p-12">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute right-[-12rem] top-[-12rem] size-[24rem] rounded-full bg-gradient-to-br from-violet-500/20 to-sky-400/15 blur-3xl" />
              <div className="absolute bottom-[-12rem] left-[-12rem] size-[24rem] rounded-full bg-gradient-to-br from-emerald-400/15 to-amber-300/10 blur-3xl" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                  Make studying a habit, not a hassle
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
                  Start free, upgrade when you want premium generation and faster workflows.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button asChild className="h-11 px-6 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white shadow-sm hover:-translate-y-px hover:opacity-95">
                  <Link href="/upload">
                    Get started <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 px-6">
                  <Link href="/dashboard">Go to dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-black/5 py-10 dark:border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 text-white shadow-sm">
                <Sparkles className="size-4" />
              </div>
              <span>© {new Date().getFullYear()} Cuemath FlashCard AI</span>
            </div>
            <div className="flex items-center gap-6">
              <a className="hover:text-zinc-900 dark:hover:text-white" href="#features">
                Features
              </a>
              <a className="hover:text-zinc-900 dark:hover:text-white" href="#how">
                How it works
              </a>
              <Link className="hover:text-zinc-900 dark:hover:text-white" href="/upload">
                Create deck
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
