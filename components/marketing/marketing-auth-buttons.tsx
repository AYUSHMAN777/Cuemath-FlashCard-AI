"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function MarketingAuthButtons() {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";
  const isUploadPage = pathname === "/upload";

  if (!isLoaded) {
    return <div className="h-9 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />;
  }

  return (
    <div className="flex items-center gap-2">
      {!isSignedIn ? (
        <>
          <SignInButton mode="modal">
            <Button variant="ghost" className="hidden h-9 px-3 sm:inline-flex">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="hidden h-9 px-3 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95 sm:inline-flex">
              Get started
            </Button>
          </SignUpButton>
          <SignUpButton mode="modal">
            <Button
              size="icon"
              className="bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95 sm:hidden"
              aria-label="Get started"
            >
              <Sparkles className="size-4" />
            </Button>
          </SignUpButton>
        </>
      ) : (
        <>
          {!isUploadPage ? (
            <Button asChild className="hidden h-9 px-3 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95 sm:inline-flex">
              <Link href="/upload">Create deck</Link>
            </Button>
          ) : null}
          {!isUploadPage ? (
            <Button
              asChild
              size="icon"
              className="bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95 sm:hidden"
            >
              <Link href="/upload" aria-label="Create deck">
                <Plus className="size-4" />
              </Link>
            </Button>
          ) : null}
          {!isDashboardPage ? (
            <Button asChild variant="ghost" className="hidden h-9 px-3 sm:inline-flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : null}
          <div className="grid place-items-center">
            <UserButton />
          </div>
        </>
      )}
    </div>
  );
}

