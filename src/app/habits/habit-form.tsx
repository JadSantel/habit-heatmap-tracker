"use client";

import { useActionState } from "react";
import { createHabit } from "./create-habit-action";
import { initialHabitState, type HabitActionState } from "./habit-form-shared";

const typeOptions = [
  { label: "Yes / No", value: "BOOLEAN" },
  { label: "Measurable", value: "MEASURABLE" },
] as const;

export function HabitCreationForm() {
  const [state, formAction, isPending] = useActionState(
    createHabit as (prevState: HabitActionState | null, formData: FormData) => Promise<HabitActionState>,
    initialHabitState,
  );

  console.log("HabitCreationForm state:", state);

  return (
    <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">New habit</p>
          <h2 className="mt-1 text-xl font-semibold text-zinc-950">Create a habit</h2>
        </div>
      </div>

      <form action={formAction} className="mt-5 space-y-5" noValidate>
        <label className="block text-sm font-medium text-zinc-800">
          Habit name
          <input
            name="name"
            type="text"
            defaultValue=""
            placeholder="Morning run"
            aria-invalid={Boolean(state.fieldErrors.name)}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        {state.fieldErrors.name ? <p className="text-sm text-red-700">{state.fieldErrors.name}</p> : null}

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-zinc-800">Habit type</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {typeOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
              >
                <input type="radio" name="type" value={option.value} defaultChecked={option.value === "BOOLEAN"} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {state.fieldErrors.type ? <p className="text-sm text-red-700">{state.fieldErrors.type}</p> : null}

        <label className="block text-sm font-medium text-zinc-800">
          Unit label
          <input
            name="unit"
            type="text"
            defaultValue=""
            placeholder="minutes, pages, km"
            aria-invalid={Boolean(state.fieldErrors.unit)}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <p className="-mt-2 text-xs text-zinc-500">Only required for measurable habits, such as minutes or pages.</p>
        {state.fieldErrors.unit ? <p className="text-sm text-red-700">{state.fieldErrors.unit}</p> : null}

        {state.message ? (
          <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-red-700"} role="status">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-zinc-950 px-4 py-2.5 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating…" : "Create habit"}
        </button>
      </form>
    </section>
  );
}
