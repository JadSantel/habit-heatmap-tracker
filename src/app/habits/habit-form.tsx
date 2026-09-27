"use client";

import { useActionState, useEffect } from "react";
import { createHabit } from "./create-habit-action";
import { initialHabitState, type HabitActionState } from "./habit-form-shared";

const typeOptions = [
  { label: "Yes / No", value: "BOOLEAN" },
  { label: "Measurable", value: "MEASURABLE" },
] as const;

type HabitCreationFormProps = {
  onSuccessClose?: () => void;
};

export function HabitCreationForm({ onSuccessClose }: HabitCreationFormProps = {}) {
  const [state, formAction, isPending] = useActionState(
    createHabit as (prevState: HabitActionState | null, formData: FormData) => Promise<HabitActionState>,
    initialHabitState,
  );

  useEffect(() => {
    if (state.success && state.message && onSuccessClose) {
      const timer = setTimeout(() => {
        onSuccessClose();
      }, 180);

      return () => clearTimeout(timer);
    }
  }, [state.success, state.message, onSuccessClose]);

  return (
    <section className="rounded-[28px] border border-[color:var(--line)] bg-white/80 p-5 shadow-[0_18px_38px_rgba(19,31,28,0.05)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[color:var(--brand-strong)]">New habit</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">Create a habit</h2>
        </div>
      </div>

      <form action={formAction} className="mt-5 space-y-5" noValidate>
        <label className="block text-sm font-medium text-[color:var(--foreground)]">
          Habit name
          <input
            name="name"
            type="text"
            defaultValue=""
            placeholder="Morning run"
            aria-invalid={Boolean(state.fieldErrors.name)}
            className="mt-1.5 w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3.5 py-2.5 text-zinc-950 outline-none transition focus:border-[color:var(--brand)] focus:bg-white focus:ring-4 focus:ring-[rgba(24,136,93,0.10)]"
          />
        </label>
        {state.fieldErrors.name ? <p className="text-sm text-red-700">{state.fieldErrors.name}</p> : null}

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[color:var(--foreground)]">Habit type</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {typeOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3.5 py-3 text-sm text-[color:var(--foreground)] transition hover:border-[color:var(--brand)]"
              >
                <input type="radio" name="type" value={option.value} defaultChecked={option.value === "BOOLEAN"} className="h-4 w-4 accent-[color:var(--brand)]" />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {state.fieldErrors.type ? <p className="text-sm text-red-700">{state.fieldErrors.type}</p> : null}

        <label className="block text-sm font-medium text-[color:var(--foreground)]">
          Unit label
          <input
            name="unit"
            type="text"
            defaultValue=""
            placeholder="minutes, pages, km"
            aria-invalid={Boolean(state.fieldErrors.unit)}
            className="mt-1.5 w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3.5 py-2.5 text-zinc-950 outline-none transition focus:border-[color:var(--brand)] focus:bg-white focus:ring-4 focus:ring-[rgba(24,136,93,0.10)]"
          />
        </label>
        <p className="-mt-2 text-xs text-[color:var(--muted)]">Only required for measurable habits, such as minutes or pages.</p>
        {state.fieldErrors.unit ? <p className="text-sm text-red-700">{state.fieldErrors.unit}</p> : null}

        {state.message ? (
          <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-red-700"} role="status">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(24,136,93,0.18)] transition hover:bg-[color:var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating…" : "Create habit"}
        </button>
      </form>
    </section>
  );
}
