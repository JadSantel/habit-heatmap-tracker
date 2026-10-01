import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HabitLogForm } from "./habit-log-form";
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
  const todayKey = getUtcDateKey(today);
  const todayEntry = entriesByDate.get(todayKey);
  const heatmapSummary = `${habit.entries.length} ${habit.entries.length === 1 ? "day" : "days"} logged in the last 365 days. ${
    todayEntry
      ? habit.type === "BOOLEAN"
        ? "Logged today."
        : `${todayEntry.value ?? 0} ${habit.unit ?? "units"} logged today.`
      : "Not logged today."
  }`;

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
    <div
      role="img"
      aria-label={heatmapSummary}
      className="mt-5 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-4 sm:px-4"
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 rounded-r-xl sm:hidden"
          style={{
            background: "linear-gradient(to right, transparent, #10100f)",
          }}
          aria-hidden="true"
        />

        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="min-w-[540px] sm:min-w-[720px]">
            <div className="mb-2 flex w-max gap-1 text-[9px] font-medium uppercase tracking-[0.14em] text-white/60 sm:mb-3">
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
              aria-hidden="true"
              dir="ltr"
            >
              {Array.from({ length: HEATMAP_DAYS }).map((_, index) => {
                const date = new Date(startDate);
                date.setUTCDate(startDate.getUTCDate() + index);
                const key = getUtcDateKey(date);
                const entry = entriesByDate.get(key);
                const isToday = key === getUtcDateKey(today);

                const baseClass = "h-[8px] w-[8px] shrink-0 rounded-[3px] transition-colors duration-200 sm:h-[10px] sm:w-[10px] md:h-[12px] md:w-[12px] lg:h-[14px] lg:w-[14px]";
                const emptyClass = "border border-white/[0.06] bg-white/[0.04]";
                const booleanClass = entry ? "border border-[#d8ad76]/30 bg-[#c28a4b]" : emptyClass;
                const measurableOpacity = typeof entry?.value === "number" && entry.value > 0 ? Math.min(1, 0.4 + (entry.value / maxValue) * 0.6) : 0;
                const measurableClass = entry && typeof entry.value === "number" && entry.value > 0 ? "border border-[#d8ad76]/30" : emptyClass;

                return (
                  <div
                    key={`${habit.id}-${key}`}
                    data-heatmap-cell={key}
                    data-entry-state={entry ? "logged" : "empty"}
                    data-entry-value={entry?.value ?? undefined}
                    aria-label={`${key}: ${entry ? (habit.type === "BOOLEAN" ? "Logged" : `${entry.value ?? 0} ${habit.unit ?? "units"}`) : "No entry"}`}
                    title={entry ? (habit.type === "BOOLEAN" ? "Logged" : `${entry.value ?? 0} ${habit.unit ?? "units"}`) : "No entry"}
                    className={`${baseClass} ${habit.type === "BOOLEAN" ? booleanClass : measurableClass} ${isToday ? "ring-2 ring-[#d8ad76] ring-offset-1 ring-offset-[#10100f]" : ""}`}
                    style={
                      habit.type === "MEASURABLE" && typeof entry?.value === "number" && entry.value > 0
                        ? { backgroundColor: `rgba(194, 138, 75, ${measurableOpacity})` }
                        : undefined
                    }
                  />
                );
              })}
            </div>
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
  const todayKey = getUtcDateKey(today);
  const loggedToday = habits.reduce(
    (sum, habit) => sum + Number(habit.entries.some((entry) => getUtcDateKey(new Date(entry.date)) === todayKey)),
    0,
  );

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f0e8] selection:bg-[#c28a4b]/40 selection:text-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-white/[0.1] pb-5">
          <Link href="/" className="text-lg font-bold tracking-[0.08em] text-white transition-colors hover:text-[#dfbd8e]">
            MapaBit
          </Link>
          <HeaderActions />
        </header>

        <section className="flex flex-col gap-5 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
          <div>
            <h1 className="text-3xl leading-tight font-semibold text-white sm:text-4xl">Your habits</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
              One year of small decisions, in view.
            </p>
          </div>
          <p className="text-sm font-medium text-white/65">
            {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </section>

        <section aria-label="Habit totals" className="grid grid-cols-3 divide-x divide-white/[0.12] border-y border-white/[0.12] py-4">
          <div className="pr-3 sm:pr-5">
            <p className="text-xs text-white/65">Habits</p>
            <p className="mt-1 text-base font-semibold tabular-nums text-white">{habits.length}</p>
          </div>
          <div className="px-3 sm:px-5">
            <p className="text-xs text-white/65">Entries · 365 days</p>
            <p className="mt-1 text-base font-semibold tabular-nums text-white">{totalEntries}</p>
          </div>
          <div className="pl-3 sm:pl-5">
            <p className="text-xs text-white/65">Logged today</p>
            <p className="mt-1 text-base font-semibold tabular-nums text-white">{loggedToday} / {habits.length}</p>
          </div>
        </section>

        {habits.length === 0 ? (
          <div className="border-b border-white/[0.1] py-14 text-center sm:py-20">
            <h2 className="text-xl font-semibold text-white">Start with one habit.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/70">
              Your year view will take shape as you log the things that matter to you.
            </p>
          </div>
        ) : (
          <section aria-label="Your habit heatmaps" className="mt-2">
            {habits.map((habit) => (
              <article
                key={habit.id}
                className="border-b border-white/[0.1] py-6 first:border-t-0 sm:py-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-lg font-semibold text-white sm:text-xl">{habit.name}</h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/65">
                      <span>
                        {habit.type === "BOOLEAN" ? "Yes / No" : `Measurable · ${habit.unit ?? "unit"}`}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${habit.entries.length > 0 ? "bg-[#d4a66d]" : "bg-white/35"}`} />
                        {habit.entries.length > 0 ? `${habit.entries.length} entries` : "No entries yet"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <div className="w-36 sm:w-40">
                      <HabitLogForm habit={habit} compact />
                    </div>
                    <HabitEditForm habit={habit} />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-white/65">
                  <span>Last 365 days</span>
                  <span>{habit.entries.length} logged</span>
                </div>
                <div className="w-full overflow-hidden">
                  <HabitHeatmap habit={habit} />
                </div>
              </article>
            ))}
          </section>
        )}

        {habits.length > 0 ? (
          <div className="flex items-center justify-end gap-2 pt-4 text-xs text-white/65" aria-label="Heatmap legend">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-[3px] border border-white/[0.06] bg-white/[0.04]" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#c28a4b]/25" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#c28a4b]/55" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#c28a4b]" />
            <span>More</span>
          </div>
        ) : null}
      </div>
    </main>
  );
}
