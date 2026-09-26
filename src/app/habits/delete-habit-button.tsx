"use client";

import { useFormStatus } from "react-dom";

export function DeleteHabitButton({ habitId }: { habitId: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={async (formData: FormData) => {
        if (typeof window !== "undefined" && !window.confirm("Delete this habit and all of its entries?")) {
          return;
        }

        const { deleteHabit } = await import("./create-habit-action");
        await deleteHabit(formData);
      }}
      disabled={pending}
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
