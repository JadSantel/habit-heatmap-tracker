import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HabitCreationForm } from "./habit-form";
import { SignOutButton } from "./sign-out-button";

export default async function HabitsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">Habit Heatmap</p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-950">Your habits</h1>
        </div>
        <SignOutButton />
      </header>

      <p className="mt-6 text-sm text-zinc-600">
        You’re signed in as <span className="font-medium text-zinc-950">{session.user.name}</span>.
      </p>

      <HabitCreationForm />

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-zinc-950">Habits</h2>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {habits.length} {habits.length === 1 ? "habit" : "habits"}
          </span>
        </div>

        {habits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-zinc-600">
            No habits yet. Create your first habit above.
          </div>
        ) : (
          <div className="grid gap-4">
            {habits.map((habit) => (
              <article key={habit.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950">{habit.name}</h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {habit.type === "BOOLEAN" ? "Yes / No" : `Measurable · ${habit.unit ?? "unit"}`}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {habit.type}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 35 }).map((_, index) => (
                    <div
                      key={`${habit.id}-${index}`}
                      className="h-3 rounded-sm border border-zinc-200 bg-zinc-100"
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
