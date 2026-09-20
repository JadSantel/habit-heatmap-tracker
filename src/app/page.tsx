import Link from "next/link";

export default function Home() {
  return <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-12"><p className="text-sm font-medium text-emerald-700">Habit Heatmap</p><h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950">Make daily progress visible.</h1><p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600">Log habits quickly and review your consistency through simple heatmaps.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="rounded-lg bg-zinc-950 px-4 py-2 font-medium text-white" href="/register">Create an account</Link><Link className="rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-800" href="/login">Sign in</Link></div></main>;
}
