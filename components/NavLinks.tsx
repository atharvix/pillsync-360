"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function NavLinks() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/" className="rounded-full px-5 py-2 text-lg font-semibold tracking-wide text-[color:var(--color-foreground)] hover:bg-black/[.04]">
        Home
      </Link>
      {user ? (
        <>
          <Link href="/dashboard" className="rounded-full px-5 py-2 text-lg font-semibold tracking-wide text-[color:var(--color-foreground)] hover:bg-black/[.04]">
            Dashboard
          </Link>
          <button
            onClick={() => signOut()}
            className="rounded-full px-5 py-2 text-lg font-semibold tracking-wide text-[color:var(--color-foreground)] hover:bg-black/[.04]"
          >
            Logout
          </button>
          <Link href="/dashboard#emergency" className="ml-3 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-5 py-2 text-lg font-bold tracking-wide text-white hover:bg-[color:var(--color-accent-hover)]">
            Emergency
          </Link>
        </>
      ) : (
        <>
          <Link href="/login" className="rounded-full px-5 py-2 text-lg font-semibold tracking-wide text-[color:var(--color-foreground)] hover:bg-black/[.04]">
            Login
          </Link>
          <Link href="/signup" className="rounded-full px-5 py-2 text-lg font-semibold tracking-wide text-[color:var(--color-foreground)] hover:bg-black/[.04]">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}

