"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <button
      className="w-full rounded-full border border-[color:var(--line)] bg-white/80 px-3.5 py-2 text-sm font-medium text-[color:var(--foreground)] shadow-sm transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand-strong)] disabled:opacity-60 sm:w-auto"
      type="button"
      onClick={signOut}
      disabled={pending}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
