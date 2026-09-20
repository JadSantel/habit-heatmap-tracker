import { LoginForm } from "./login-form";

export default function LoginPage() {
  return <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12"><section className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"><p className="text-sm font-medium text-emerald-700">Habit Heatmap</p><h1 className="mt-2 text-2xl font-semibold text-zinc-950">Welcome back</h1><p className="mt-2 text-zinc-600">Sign in to continue tracking your habits.</p><LoginForm /></section></main>;
}
