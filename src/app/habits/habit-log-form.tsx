"use client";

import { useActionState } from "react";
import { initialHabitLogState, type HabitLogActionState } from "./habit-log-shared";
import { logHabitEntry } from "./log-habit-action";

type HabitSummary = {
  id: string;
  name: string;
  type: "BOOLEAN" | "MEASURABLE";
  unit: string | null;
  entries: Array<{ date: Date; value: number | null }>;
};

function getUtcDateKey(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString().slice(0, 10);
}

export function HabitLogForm({ habit }: { habit: HabitSummary }) {
  const [state, formAction, isPending] = useActionState(
    logHabitEntry as (prevState: HabitLogActionState | null, formData: FormData) => Promise<HabitLogActionState>,
    initialHabitLogState,
  );

  const todayKey = getUtcDateKey(new Date());
  const loggedToday = habit.entries.some((entry) => getUtcDateKey(new Date(entry.date)) === todayKey);

  const todayValue = habit.entries.find((entry) => getUtcDateKey(new Date(entry.date)) === todayKey)?.value;

  return (
    <form action={formAction} className="mt-5 space-y-3" noValidate>
      <input type="hidden" name="habitId" value={habit.id} />

      {habit.type === "BOOLEAN" ? (
        <>
          <input type="hidden" name="value" value="true" />
          <button
            type="submit"
            disabled={isPending || loggedToday}
            className="w-full rounded-full bg-[color:var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(24,136,93,0.18)] transition-all hover:bg-[color:var(--brand-strong)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 disabled:shadow-none disabled:active:scale-100"
          >
            {isPending ? "Logging…" : loggedToday ? "Logged today" : "Done today"}
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor={`habit-value-${habit.id}`}>
            {habit.name} value
          </label>
          <input
            id={`habit-value-${habit.id}`}
            name="value"
            type="number"
            min="0.1"
            step="0.1"
            defaultValue={todayValue ?? ""}
            placeholder={habit.unit ?? "value"}
            aria-invalid={Boolean(state.fieldErrors.value)}
            className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3.5 py-2.5 text-zinc-950 outline-none transition-all focus:border-[color:var(--brand)] focus:bg-white focus:ring-4 focus:ring-[rgba(24,136,93,0.10)]"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[color:var(--foreground)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0f201d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            {isPending ? "…" : "Log"}
          </button>
        </div>
      )}

      {state.fieldErrors.value ? <p className="text-sm text-red-700">{state.fieldErrors.value}</p> : null}

      {state.message ? (
        <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-red-700"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
