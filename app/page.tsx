import { currentUser } from "@clerk/nextjs/server";
import { UserNav } from "@/components/auth/user-nav";
import { env } from "@/lib/env";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
        <h1 className="text-xl font-semibold tracking-tight">FlashCard AI</h1>
        <UserNav />
      </header>

      <section className="space-y-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <h2 className="text-lg font-medium">Production-ready foundation</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Clerk authentication, Supabase clients, and validated environment variables are configured.
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Signed in user:</span>{" "}
            {user?.emailAddresses[0]?.emailAddress ?? "Not signed in"}
          </p>
          <p>
            <span className="font-medium">Supabase URL:</span> {env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
        </div>
      </section>
    </main>
  );
}
