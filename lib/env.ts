import { z } from "zod";

const isServer = typeof window === "undefined";

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  // Make secret required on the server, but optional in the browser
  CLERK_SECRET_KEY: isServer ? z.string().min(1) : z.string().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  const issues = JSON.stringify(parsed.error.flatten().fieldErrors);
  throw new Error(
    `Invalid environment variables: ${issues}. Update .env.local and restart the dev server.`,
  );
}

export const env = parsed.data;