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

export function HabitLogForm({ habit, compact = false }: { habit: HabitSummary; compact?: boolean }) {
  const [state, formAction, isPending] = useActionState(
    logHabitEntry as (prevState: HabitLogActionState | null, formData: FormData) => Promise<HabitLogActionState>,
    initialHabitLogState,
  );

  const todayKey = getUtcDateKey(new Date());
  const loggedToday = habit.entries.some((entry) => getUtcDateKey(new Date(entry.date)) === todayKey);

  const todayValue = habit.entries.find((entry) => getUtcDateKey(new Date(entry.date)) === todayKey)?.value;
  const formClassName = compact ? "space-y-2" : "mt-5 space-y-3";
  const inputClassName = compact
    ? "w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-[#d8ad76] focus:ring-2 focus:ring-[#c28a4b]/25"
    : "w-full rounded-xl border border-white/[0.12] bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition-all focus:border-[#d8ad76] focus:ring-2 focus:ring-[#c28a4b]/25";
  const buttonClassName = compact
    ? "w-full rounded-full bg-[#c28a4b] px-3 py-2 text-xs font-semibold text-[#1b130a] transition hover:bg-[#d1a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89] disabled:cursor-not-allowed disabled:bg-white/[0.1] disabled:text-white/55"
    : "w-full rounded-full bg-[#c28a4b] px-4 py-3 text-sm font-semibold text-[#1b130a] transition-all hover:bg-[#d1a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/[0.1] disabled:text-white/55 disabled:active:scale-100";

  return (
    <form action={formAction} className={formClassName} noValidate>
      <input type="hidden" name="habitId" value={habit.id} />

      {habit.type === "BOOLEAN" ? (
        <>
          <input type="hidden" name="value" value="true" />
          <button
            type="submit"
            disabled={isPending || loggedToday}
            className={buttonClassName}
          >
            {isPending ? "Logging…" : loggedToday ? "Logged today" : "Done today"}
          </button>
        </>
      ) : (
        <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row"}>
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
            aria-describedby={state.fieldErrors.value ? `habit-value-error-${habit.id}` : undefined}
            className={inputClassName}
          />
          <button
            type="submit"
            disabled={isPending}
            className={compact ? "rounded-full bg-[#c28a4b] px-4 py-2 text-xs font-semibold text-[#1b130a] transition hover:bg-[#d1a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89] disabled:cursor-not-allowed disabled:opacity-60" : "rounded-full bg-[#c28a4b] px-5 py-2.5 text-sm font-semibold text-[#1b130a] transition-all hover:bg-[#d1a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"}
          >
            {isPending ? "…" : "Log"}
          </button>
        </div>
      )}

      {state.fieldErrors.value ? <p id={`habit-value-error-${habit.id}`} className="text-sm text-red-300">{state.fieldErrors.value}</p> : null}

      {state.message ? (
        <p className={state.success ? "text-sm text-emerald-300" : "text-sm text-red-300"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
