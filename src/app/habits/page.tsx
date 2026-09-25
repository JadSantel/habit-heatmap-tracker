import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export default async function HabitsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    redirect("/login");
  return <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-emerald-700">Habit Heatmap</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-950">Your habits</h1>
      </div>
      <SignOutButton />
    </header>

    <section className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-6">
      <h2 className="font-semibold text-zinc-950">You’re signed in, {session.user.name}.</h2>
      <p className="mt-2 text-zinc-600">Habit creation arrives in the next milestone.</p>
    </section>
  </main>
}
