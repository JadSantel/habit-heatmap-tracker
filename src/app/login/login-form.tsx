"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

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
      {/* Social Login Options */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={() => handleSocial("google")}
          disabled={socialPending !== null || pending}
          type="button"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
        >
          <GoogleIcon />
          <span>{socialPending === "google" ? "Connecting…" : "Google"}</span>
        </button>
        <button
          onClick={() => handleSocial("github")}
          disabled={socialPending !== null || pending}
          type="button"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
        >
          <GitHubIcon />
          <span>{socialPending === "github" ? "Connecting…" : "GitHub"}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
          Or continue with email
        </span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={submit} noValidate>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="ada@example.com"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="••••••••"
        />

        {error && (
          <div
            className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.08] px-3.5 py-2.5 text-xs font-medium text-rose-300"
            role="alert"
          >
            <svg
              className="h-4 w-4 shrink-0 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-900 shadow-[0_0_32px_rgba(255,255,255,0.08)] transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_0_48px_rgba(255,255,255,0.18)] active:scale-[0.99] disabled:opacity-50"
            disabled={pending || socialPending !== null}
          >
            {pending ? "Signing in…" : "Sign in"}
            {!pending && (
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>

        <p className="pt-2 text-center text-sm text-white/45">
          New here?{" "}
          <Link
            className="font-medium text-[#daac68] underline-offset-4 hover:underline hover:text-[#e8be82] transition-colors"
            href="/register"
          >
            Create an account
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
      {label}
      <input
        className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-white/[0.035] px-3.5 py-2.5 text-sm font-normal normal-case text-white placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#daac68]/80 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#c2703a]/25 caret-[#daac68]"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
      />
    </label>
  );
}
