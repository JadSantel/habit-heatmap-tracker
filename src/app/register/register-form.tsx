"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const schema = z.object({ name: z.string().trim().min(1, "Enter your name.").max(80), email: z.email("Enter a valid email address."), password: z.string().min(8, "Password must be at least 8 characters.").max(128) });

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState<"google" | "github" | null>(null);

  async function handleSocial(provider: "google" | "github") {
    setSocialPending(provider);
    await authClient.signIn.social({ provider, callbackURL: "/habits" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null);
    const parsed = schema.safeParse({ name, email: email.trim().toLowerCase(), password });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check your details.");
    setPending(true);
    const { error: authError } = await authClient.signUp.email({ ...parsed.data, callbackURL: "/habits" });
    setPending(false);
    if (authError) return setError(authError.message ?? "Unable to create your account.");
    router.replace("/habits"); router.refresh();
  }
  return <div className="mt-8">
    <div className="flex flex-col gap-3">
      <button onClick={() => handleSocial("google")} disabled={socialPending !== null || pending} type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-60">
        {socialPending === "google" ? "Connecting…" : "Continue with Google"}
      </button>
      <button onClick={() => handleSocial("github")} disabled={socialPending !== null || pending} type="button" className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:opacity-60">
        {socialPending === "github" ? "Connecting…" : "Continue with GitHub"}
      </button>
    </div>
    <div className="relative mt-8 mb-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:block after:border-t after:border-zinc-200">
      <span className="relative z-10 bg-white px-2 text-zinc-500">Or continue with email</span>
    </div>
    <form className="space-y-5" onSubmit={submit} noValidate>
      <Field label="Name" type="text" value={name} onChange={setName} autoComplete="name" />
      <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" hint="At least 8 characters." />
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button className="w-full rounded-lg bg-zinc-950 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={pending || socialPending !== null}>{pending ? "Creating account…" : "Create account"}</button>
      <p className="text-center text-sm text-zinc-600">Already have an account? <Link className="font-medium underline" href="/login">Sign in</Link>.</p>
    </form>
  </div>;
}

function Field({ label, type, value, onChange, autoComplete, hint }: { label: string; type: string; value: string; onChange: (value: string) => void; autoComplete: string; hint?: string }) {
  return <label className="block text-sm font-medium text-zinc-800">{label}<input className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none focus:ring-2" type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required />{hint && <span className="mt-1 block text-xs font-normal text-zinc-500">{hint}</span>}</label>;
}
