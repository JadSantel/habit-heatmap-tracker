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
  return <button className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 disabled:opacity-60" type="button" onClick={signOut} disabled={pending}>{pending ? "Signing out…" : "Sign out"}
  </button>;
}
