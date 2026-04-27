"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function MarketingAuthButtons() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="h-9 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />;
  }

  return (
    <div className="flex items-center gap-2">
      {!isSignedIn ? (
        <>
          <SignInButton mode="modal">
            <Button variant="ghost" className="h-9 px-3">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="h-9 px-3 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95">
              Get started
            </Button>
          </SignUpButton>
        </>
      ) : (
        <>
          <Button asChild className="h-9 px-3 bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 text-white hover:opacity-95">
            <Link href="/upload">Create deck</Link>
          </Button>
          <Button asChild variant="ghost" className="h-9 px-3">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <div className="ml-1 grid place-items-center">
            <UserButton />
          </div>
        </>
      )}
    </div>
  );
}

