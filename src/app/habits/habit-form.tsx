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
    <section className="px-1 pb-1">
      <form action={formAction} className="mt-5 space-y-5" noValidate>
        <label className="block text-sm font-medium text-white/85">
          Habit name
          <input
            name="name"
            type="text"
            autoFocus
            defaultValue=""
            placeholder="Morning run"
            aria-invalid={Boolean(state.fieldErrors.name)}
            aria-describedby={state.fieldErrors.name ? "create-habit-name-error" : undefined}
            className="mt-1.5 w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3.5 py-2.5 text-white placeholder:text-white/50 outline-none transition focus:border-[#d8ad76] focus:ring-2 focus:ring-[#c28a4b]/25"
          />
        </label>
        {state.fieldErrors.name ? <p id="create-habit-name-error" className="text-sm text-red-300">{state.fieldErrors.name}</p> : null}

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-white/85">Habit type</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {typeOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3.5 py-3 text-sm text-white/85 transition hover:border-[#d8ad76]/70"
              >
                <input type="radio" name="type" value={option.value} defaultChecked={option.value === "BOOLEAN"} className="h-4 w-4 accent-[#c28a4b]" />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {state.fieldErrors.type ? <p className="text-sm text-red-300">{state.fieldErrors.type}</p> : null}

        <label className="block text-sm font-medium text-white/85">
          Unit label
          <input
            name="unit"
            type="text"
            defaultValue=""
            placeholder="minutes, pages, km"
            aria-invalid={Boolean(state.fieldErrors.unit)}
            aria-describedby={state.fieldErrors.unit ? "create-habit-unit-error" : "create-habit-unit-hint"}
            className="mt-1.5 w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3.5 py-2.5 text-white placeholder:text-white/50 outline-none transition focus:border-[#d8ad76] focus:ring-2 focus:ring-[#c28a4b]/25"
          />
        </label>
        <p id="create-habit-unit-hint" className="-mt-2 text-xs text-white/65">Only required for measurable habits, such as minutes or pages.</p>
        {state.fieldErrors.unit ? <p id="create-habit-unit-error" className="text-sm text-red-300">{state.fieldErrors.unit}</p> : null}

        {state.message ? (
          <p className={state.success ? "text-sm text-emerald-300" : "text-sm text-red-300"} role="status">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[#c28a4b] px-4 py-2.5 text-sm font-semibold text-[#1b130a] transition hover:bg-[#d1a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating…" : "Create habit"}
        </button>
      </form>
    </section>
  );
}
