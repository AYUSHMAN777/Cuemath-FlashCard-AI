"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export function UserNav() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />;
  }

  return (
    <div className="flex items-center gap-3">
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
          >
            Sign in
          </button>
        </SignInButton>
      ) : (
        <UserButton />
      )}
    </div>
  );
}
