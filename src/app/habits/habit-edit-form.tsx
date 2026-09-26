"use client";

import { useActionState, useState } from "react";
import { updateHabit } from "./create-habit-action";
import { initialHabitState, type HabitActionState } from "./habit-form-shared";

type HabitEditFormProps = {
  habit: {
    id: string;
    name: string;
    type: "BOOLEAN" | "MEASURABLE";
    unit: string | null;
  };
};

export function HabitEditForm({ habit }: HabitEditFormProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateHabit as (prevState: HabitActionState | null, formData: FormData) => Promise<HabitActionState>,
    initialHabitState,
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400"
      >
        {open ? "Cancel" : "Edit"}
      </button>

      {open ? (
        <form action={formAction} className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4" noValidate>
          <input type="hidden" name="habitId" value={habit.id} />
          <input type="hidden" name="type" value={habit.type} />

          <label className="block text-sm font-medium text-zinc-800">
            Habit name
            <input
              name="name"
              type="text"
              defaultValue={habit.name}
              aria-invalid={Boolean(state.fieldErrors.name)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          {state.fieldErrors.name ? <p className="mt-2 text-sm text-red-700">{state.fieldErrors.name}</p> : null}

          <div className="mt-4 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
            Type: <span className="font-medium text-zinc-950">{habit.type === "BOOLEAN" ? "Yes / No" : "Measurable"}</span>
          </div>

          {habit.type === "MEASURABLE" ? (
            <label className="mt-4 block text-sm font-medium text-zinc-800">
              Unit label
              <input
                name="unit"
                type="text"
                defaultValue={habit.unit ?? ""}
                aria-invalid={Boolean(state.fieldErrors.unit)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          ) : null}
          {state.fieldErrors.unit ? <p className="mt-2 text-sm text-red-700">{state.fieldErrors.unit}</p> : null}

          {state.message ? (
            <p className={state.success ? "mt-3 text-sm text-emerald-700" : "mt-3 text-sm text-red-700"} role="status">
              {state.message}
            </p>
          ) : null}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
