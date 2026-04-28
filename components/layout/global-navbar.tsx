"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingAuthButtons } from "@/components/marketing/marketing-auth-buttons";
import { StreakBadge } from "@/components/streak/streak-badge";

export function GlobalNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDashboardPage =
    pathname === "/dashboard" || pathname.startsWith("/deck/") || pathname.startsWith("/practice/");
  const isUploadPage = pathname === "/upload" || pathname.startsWith("/practice/") || pathname.startsWith("/deck/");
  const hideCenterNav = pathname === "/upload" || pathname === "/dashboard";
  const navLinks = useMemo(
    () =>
      [
        { href: "/dashboard", label: "Dashboard", hidden: isDashboardPage },
        { href: "/upload", label: "Upload", hidden: isUploadPage },
      ].filter((link) => !link.hidden),
    [isDashboardPage, isUploadPage]
  );

  // Homepage already renders its own marketing navbar.
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="min-w-0 flex items-center gap-2">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 text-white shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <span className="truncate text-sm font-semibold tracking-tight">Cuemath FlashCard AI</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          {!hideCenterNav
            ? navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-zinc-900 dark:hover:text-white">
                  {link.label}
                </Link>
              ))
            : null}
        </nav>

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
            {navLinks.length > 0 ? (
              <nav className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

