import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HabitEditForm } from "./habit-edit-form";
import { HeaderActions } from "./header-actions";

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

  const monthLabels: string[] = [];
  const monthCursor = new Date(startDate);

  while (monthCursor <= today) {
    monthLabels.push(
      monthCursor.toLocaleDateString("en-US", {
        month: "short",
      }),
    );
    monthCursor.setUTCMonth(monthCursor.getUTCMonth() + 1, 1);
  }

  return (
    <div className="mt-6 w-full px-2 pb-4 pt-1">
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 rounded-r-xl sm:hidden"
          style={{
            background: "linear-gradient(to right, transparent, var(--panel-strong))",
          }}
          aria-hidden="true"
        />

        <div className="min-w-[860px] overflow-x-auto scrollbar-hide">
          <div className="mb-2 flex w-max gap-1 text-[9px] font-medium uppercase tracking-[0.18em] text-muted sm:mb-3">
            {monthLabels.map((month, index) => (
              <span
                key={`${habit.id}-month-${month}-${index}`}
                className="w-[calc((8px+2px)*4.33)] shrink-0 whitespace-nowrap sm:w-[calc((10px+3px)*4.33)] md:w-[calc((12px+3px)*4.33)] lg:w-[calc((14px+3px)*4.33)]"
              >
                {month}
              </span>
            ))}
          </div>

          <div
            className="grid w-max grid-flow-col grid-rows-7 gap-0.5 sm:gap-0.75"
            aria-label={`${habit.type === "BOOLEAN" ? "Boolean" : "Measurable"} habit heatmap`}
            dir="ltr"
          >
            {Array.from({ length: HEATMAP_DAYS }).map((_, index) => {
              const date = new Date(startDate);
              date.setUTCDate(startDate.getUTCDate() + index);
              const key = getUtcDateKey(date);
              const entry = entriesByDate.get(key);
              const isToday = key === getUtcDateKey(today);

              const baseClass = "h-[8px] w-[8px] shrink-0 rounded-[4px] transition-all duration-200 sm:h-[10px] sm:w-[10px] md:h-[12px] md:w-[12px] lg:h-[14px] lg:w-[14px]";
              const booleanClass = entry ? "border border-emerald-600/20 bg-emerald-500 shadow-sm shadow-emerald-500/20" : "border border-(--line) bg-emerald-50/80";
              const measurableOpacity = typeof entry?.value === "number" && entry.value > 0 ? Math.min(1, 0.4 + (entry.value / maxValue) * 0.6) : 0;
              const measurableClass = entry && typeof entry.value === "number" && entry.value > 0 ? "border border-emerald-600/20 shadow-sm shadow-emerald-500/10" : "border border-(--line) bg-emerald-50/80";

              return (
                <div
                  key={`${habit.id}-${key}`}
                  aria-label={`${key}: ${entry ? (habit.type === "BOOLEAN" ? "Logged" : `${entry.value ?? 0} ${habit.unit ?? "units"}`) : "No entry"}`}
                  title={entry ? (habit.type === "BOOLEAN" ? "Logged today" : `${entry.value ?? 0} ${habit.unit ?? "units"}`) : "No entry"}
                  className={`${baseClass} ${habit.type === "BOOLEAN" ? booleanClass : measurableClass} ${isToday ? "ring-2 ring-emerald-600/70 ring-offset-1 ring-offset-white" : ""}`}
                  style={
                    habit.type === "MEASURABLE" && typeof entry?.value === "number" && entry.value > 0
                      ? { backgroundColor: `rgba(24, 136, 93, ${measurableOpacity})` }
                      : undefined
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
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

  const totalEntries = habits.reduce((sum, habit) => sum + habit.entries.length, 0);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-(--brand-strong)">Habit Heatmap</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            Your habits
          </h1>
        </div>
        <HeaderActions />
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-(--line) bg-white/75 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Habits</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-foreground">{habits.length}</p>
        </div>
        <div className="rounded-2xl border border-(--line) bg-white/75 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Entries</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-foreground">{totalEntries}</p>
        </div>
        <div className="rounded-2xl border border-(--line) bg-white/75 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Focus</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-foreground">{habits.length > 0 ? "Daily" : "Start"}</p>
        </div>
      </section>

      <section className="mt-8">
        {habits.length === 0 ? (
          <div className="mt-4 overflow-hidden rounded-[32px] border border-(--line) bg-gradient-to-br from-white/90 via-white/75 to-(--brand-soft)/80 p-6 shadow-[0_24px_60px_rgba(20,35,29,0.08)] sm:p-8">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-soft) text-(--brand-strong) shadow-inner shadow-emerald-100">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-foreground">Start your first streak</h3>
              <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
                Add a habit that matters, log it daily, and let the heatmap become a visible rhythm you can trust.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-(--line) bg-white/85 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Tap the + button above to begin
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {habits.map((habit) => (
              <article
                key={habit.id}
                className="group relative overflow-hidden rounded-[30px] border border-(--line) bg-white/80 p-4 shadow-[0_18px_38px_rgba(19,31,28,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-(--brand-muted) hover:bg-white/90 hover:shadow-[0_24px_48px_rgba(17,30,27,0.11)] focus-within:border-(--brand) focus-within:shadow-[0_20px_42px_rgba(17,30,27,0.1)] sm:p-5"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold tracking-[-0.04em] text-foreground">{habit.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-(--brand-soft) px-2.5 py-1 text-[11px] font-medium text-(--brand-strong)">
                        {habit.type === "BOOLEAN" ? "Yes / No" : `Measurable · ${habit.unit ?? "unit"}`}
                      </span>
                      <span className="rounded-full border border-(--line) bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {habit.entries.length > 0 ? "Active" : "Fresh"}
                      </span>
                    </div>
                  </div>
                  <div className="self-start">
                    <HabitEditForm habit={habit} />
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto rounded-2xl border border-(--line) bg-(--panel-strong) p-3 transition-colors group-hover:bg-white">
                  <HabitHeatmap habit={habit} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
