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
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-200"
          >
            {isPending ? "Logging…" : loggedToday ? "Logged today" : "Done today"}
          </button>
        </>
      ) : (
        <div className="flex gap-2">
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
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Logging…" : "Log"}
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
