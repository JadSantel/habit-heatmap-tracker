"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const schema = z.object({ email: z.email("Enter a valid email address."), password: z.string().min(1, "Enter your password.") });

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState<"google" | "github" | null>(null);

  async function handleSocial(provider: "google" | "github") {
    setSocialPending(provider);
    await authClient.signIn.social({ provider, callbackURL: "/habits" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email: email.trim().toLowerCase(), password });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check your details.");
    setPending(true);
    const { error: authError } = await authClient.signIn.email({ ...parsed.data, callbackURL: "/habits" });
    setPending(false);
    if (authError) return setError(authError.message ?? "Unable to sign in.");
    router.replace("/habits");
    router.refresh();
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleSocial("google")}
          disabled={socialPending !== null || pending}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand-strong)] disabled:opacity-60"
        >
          {socialPending === "google" ? "Connecting…" : "Continue with Google"}
        </button>
        <button
          onClick={() => handleSocial("github")}
          disabled={socialPending !== null || pending}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(24,136,93,0.18)] transition hover:bg-[color:var(--brand-strong)] disabled:opacity-60"
        >
          {socialPending === "github" ? "Connecting…" : "Continue with GitHub"}
        </button>
      </div>

      <div className="relative my-6 text-center text-sm text-[color:var(--muted)] before:absolute before:left-0 before:right-0 before:top-1/2 before:h-px before:bg-[color:var(--line)]">
        <span className="relative bg-white px-3">Or continue with email</span>
      </div>

      <form className="space-y-5" onSubmit={submit} noValidate>
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        <button
          className="w-full rounded-full bg-[color:var(--foreground)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f201d] disabled:opacity-60"
          disabled={pending || socialPending !== null}
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-[color:var(--muted)]">
          New here? <Link className="font-semibold text-[color:var(--brand-strong)] underline-offset-2 hover:underline" href="/register">Create an account</Link>.
        </p>
      </form>
    </div>
  );
}

function Field({ label, type, value, onChange, autoComplete }: { label: string; type: string; value: string; onChange: (value: string) => void; autoComplete: string }) {
  return (
    <label className="block text-sm font-medium text-[color:var(--foreground)]">
      {label}
      <input
        className="mt-1.5 w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3.5 py-2.5 text-zinc-950 outline-none transition focus:border-[color:var(--brand)] focus:bg-white focus:ring-4 focus:ring-[rgba(24,136,93,0.10)]"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
      />
    </label>
  );
}
