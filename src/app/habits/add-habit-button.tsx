"use client";

import { useState } from "react";
import { HabitCreationForm } from "./habit-form";

export function AddHabitButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(24,136,93,0.18)] transition hover:bg-[color:var(--brand-strong)] sm:w-auto"
      >
        Add a new habit
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12211d]/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[30px] border border-[color:var(--line)] bg-white p-4 shadow-[0_30px_70px_rgba(11,18,16,0.18)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[color:var(--brand-strong)]">New habit</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[color:var(--foreground)]">
                  Add a habit
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--brand)]"
              >
                Close
              </button>
            </div>

            <HabitCreationForm onSuccessClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
