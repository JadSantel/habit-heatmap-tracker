"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { deleteHabit, updateHabit } from "./create-habit-action";
import { initialHabitState, type HabitActionState } from "./habit-form-shared";
import { initialHabitLogState, type HabitLogActionState } from "./habit-log-shared";
import { logHabitEntry } from "./log-habit-action";

type HabitEditFormProps = {
  habit: {
    id: string;
    name: string;
    type: "BOOLEAN" | "MEASURABLE";
    unit: string | null;
    entries: Array<{ date: Date; value: number | null }>;
  };
};

export function HabitEditForm({ habit }: HabitEditFormProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateHabit as (prevState: HabitActionState | null, formData: FormData) => Promise<HabitActionState>,
    initialHabitState,
  );
  const [logState, logFormAction, isLogPending] = useActionState(
    logHabitEntry as (prevState: HabitLogActionState | null, formData: FormData) => Promise<HabitLogActionState>,
    initialHabitLogState,
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target;
      if (menuRef.current && target instanceof Node && !menuRef.current.contains(target)) {
        setMenuOpen(false);
        setEditOpen(false);
        setLogOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={`Open actions for ${habit.name}`}
        onClick={() => setMenuOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-white/75 transition hover:border-[#d8ad76]/60 hover:bg-white/[0.08] hover:text-[#e1bc89] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89]"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {menuOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-white/[0.12] bg-[#10100f]/95 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          {editOpen ? (
            <form action={formAction} className="space-y-4" noValidate>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Edit habit</h4>
                <button type="button" onClick={() => { setEditOpen(false); setLogOpen(false); }} className="text-xs font-medium text-white/65 transition hover:text-white">
                  Back
                </button>
              </div>

              <input type="hidden" name="habitId" value={habit.id} />
              <input type="hidden" name="type" value={habit.type} />

              <label className="block text-sm font-medium text-white/85">
                Habit name
                <input
                  name="name"
                  type="text"
                  defaultValue={habit.name}
                  aria-invalid={Boolean(state.fieldErrors.name)}
                  className="mt-1 w-full rounded-lg border border-white/[0.14] bg-white/[0.05] px-3 py-2 text-white outline-none transition focus:border-[#d8ad76] focus:ring-2 focus:ring-[#c28a4b]/25"
                />
              </label>
              {state.fieldErrors.name ? <p className="text-sm text-red-300">{state.fieldErrors.name}</p> : null}

              <div className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-sm text-white/65">
                Type: <span className="font-medium text-white">{habit.type === "BOOLEAN" ? "Yes / No" : "Measurable"}</span>
              </div>

              {habit.type === "MEASURABLE" ? (
                <label className="block text-sm font-medium text-white/85">
                  Unit label
                  <input
                    name="unit"
                    type="text"
                    defaultValue={habit.unit ?? ""}
                    aria-invalid={Boolean(state.fieldErrors.unit)}
                    className="mt-1 w-full rounded-lg border border-white/[0.14] bg-white/[0.05] px-3 py-2 text-white outline-none transition focus:border-[#d8ad76] focus:ring-2 focus:ring-[#c28a4b]/25"
                  />
                </label>
              ) : null}
              {state.fieldErrors.unit ? <p className="text-sm text-red-300">{state.fieldErrors.unit}</p> : null}

              {state.message ? (
                <p className={state.success ? "text-sm text-emerald-300" : "text-sm text-red-300"} role="status">
                  {state.message}
                </p>
              ) : null}

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setMenuOpen(false)} className="rounded-full border border-white/[0.14] bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89]">
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-[#c28a4b] px-4 py-2 text-sm font-semibold text-[#1b130a] transition hover:bg-[#d1a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          ) : logOpen ? (
            <form action={logFormAction} className="space-y-3" noValidate>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Log habit</h4>
                <button type="button" onClick={() => setLogOpen(false)} className="text-xs font-medium text-white/65 transition hover:text-white">
                  Back
                </button>
              </div>

              <input type="hidden" name="habitId" value={habit.id} />

              {habit.type === "BOOLEAN" ? (
                <>
                  <input type="hidden" name="value" value="true" />
                  <button
                    type="submit"
                    disabled={isLogPending}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c28a4b] px-3 py-2.5 text-sm font-semibold text-[#1b130a] transition hover:bg-[#d1a36a] disabled:cursor-not-allowed disabled:bg-white/[0.1] disabled:text-white/50"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
                      <path d="M6 4.75A2.75 2.75 0 0 1 8.75 2h6.5A2.75 2.75 0 0 1 18 4.75V18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4.75Zm5 3.5h4m-4 4h4m-4 4h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {isLogPending ? "Logging…" : "Log"}
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/85">
                    Value
                    <input
                      name="value"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder={habit.unit ?? "value"}
                      aria-invalid={Boolean(logState.fieldErrors.value)}
                      className="mt-1 w-full rounded-lg border border-white/[0.14] bg-white/[0.05] px-3 py-2 text-white placeholder:text-white/50 outline-none transition focus:border-[#d8ad76] focus:ring-2 focus:ring-[#c28a4b]/25"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isLogPending}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c28a4b] px-3 py-2.5 text-sm font-semibold text-[#1b130a] transition hover:bg-[#d1a36a] disabled:cursor-not-allowed disabled:bg-white/[0.1] disabled:text-white/50"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
                      <path d="M6 4.75A2.75 2.75 0 0 1 8.75 2h6.5A2.75 2.75 0 0 1 18 4.75V18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4.75Zm5 3.5h4m-4 4h4m-4 4h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {isLogPending ? "Logging…" : "Log"}
                  </button>
                </div>
              )}

              {logState.fieldErrors.value ? <p className="text-sm text-red-300">{logState.fieldErrors.value}</p> : null}

              {logState.message ? (
                <p className={logState.success ? "text-sm text-emerald-300" : "text-sm text-red-300"} role="status">
                  {logState.message}
                </p>
              ) : null}
            </form>
          ) : (
            <div className="space-y-2">
              
              <button
                type="button"
                onClick={() => setLogOpen(true)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-white/85 transition hover:bg-white/[0.08]"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
                  <path d="M6 4.75A2.75 2.75 0 0 1 8.75 2h6.5A2.75 2.75 0 0 1 18 4.75V18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4.75Zm5 3.5h4m-4 4h4m-4 4h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Log
              </button>
              
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-white/85 transition hover:bg-white/[0.08]"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit habit
              </button>

              <form
                action={async (formData: FormData) => {
                  if (typeof window !== "undefined" && !window.confirm("Delete this habit and all of its entries?")) {
                    return;
                  }

                  await deleteHabit(formData);
                }}
              >
                <input type="hidden" name="habitId" value={habit.id} />
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
                    <path d="M3 6h18M8 6V4h8v2m-9 0 1 12h8l1-12M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete habit
                </button>
              </form>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
