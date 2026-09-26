import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteHabitButton } from "./delete-habit-button";
import { HabitCreationForm } from "./habit-form";
import { HabitEditForm } from "./habit-edit-form";
import { HabitLogForm } from "./habit-log-form";
import { SignOutButton } from "./sign-out-button";

const HEATMAP_DAYS = 365;

function getUtcDateKey(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString().slice(0, 10);
}

function HabitHeatmap({ habit }: { habit: { id: string; type: "BOOLEAN" | "MEASURABLE"; unit: string | null; entries: Array<{ date: Date; value: number | null }> } }) {
  const today = new Date();
  const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - (HEATMAP_DAYS - 1)));
  const entriesByDate = new Map(
    habit.entries.map((entry) => [getUtcDateKey(new Date(entry.date)), entry]),
  );

  const measurableValues = habit.entries
    .map((entry) => entry.value)
    .filter((value): value is number => typeof value === "number" && value > 0);
  const maxValue = measurableValues.length > 0 ? Math.max(...measurableValues) : 1;

  return (
    <div className="mt-5 grid grid-cols-7 gap-1.5" aria-label={`${habit.type === "BOOLEAN" ? "Boolean" : "Measurable"} habit heatmap`}>
      {Array.from({ length: HEATMAP_DAYS }).map((_, index) => {
        const date = new Date(startDate);
        date.setUTCDate(startDate.getUTCDate() + index);
        const key = getUtcDateKey(date);
        const entry = entriesByDate.get(key);
        const isToday = key === getUtcDateKey(today);

        const baseClass = "h-3 rounded-sm border border-zinc-200";
        const booleanClass = entry ? "bg-emerald-500" : "bg-zinc-100";
        const measurableOpacity = typeof entry?.value === "number" && entry.value > 0 ? Math.min(1, 0.4 + (entry.value / maxValue) * 0.6) : 0;
        const measurableClass = entry && typeof entry.value === "number" && entry.value > 0 ? "border-emerald-600" : "bg-zinc-100";

        return (
          <div
            key={`${habit.id}-${key}`}
            aria-label={`${key}: ${entry ? (habit.type === "BOOLEAN" ? "Logged" : `${entry.value ?? 0} ${habit.unit ?? "units"}`) : "No entry"}`}
            title={entry ? (habit.type === "BOOLEAN" ? "Logged today" : `${entry.value ?? 0} ${habit.unit ?? "units"}`) : "No entry"}
            className={`${baseClass} ${habit.type === "BOOLEAN" ? booleanClass : measurableClass} ${isToday ? "ring-1 ring-emerald-700" : ""}`}
            style={
              habit.type === "MEASURABLE" && typeof entry?.value === "number" && entry.value > 0
                ? { backgroundColor: `rgba(16, 185, 129, ${measurableOpacity})` }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

export default async function HabitsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const today = new Date();
  const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - (HEATMAP_DAYS - 1)));

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      entries: {
        where: {
          date: {
            gte: startDate,
          },
        },
        orderBy: { date: "asc" },
      },
    },
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

                <div className="mt-4 flex items-center justify-end gap-2">
                  <HabitEditForm habit={habit} />
                  <form action={async (formData: FormData) => {
                    "use server";
                    const { deleteHabit } = await import("./create-habit-action");
                    await deleteHabit(formData);
                  }}>
                    <input type="hidden" name="habitId" value={habit.id} />
                    <DeleteHabitButton habitId={habit.id} />
                  </form>
                </div>

                <HabitHeatmap habit={habit} />
                <HabitLogForm habit={habit} />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
