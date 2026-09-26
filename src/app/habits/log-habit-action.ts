"use server";

import { revalidatePath } from "next/cache";
import { logHabitEntrySchema, type HabitLogActionState } from "./habit-log-shared";

export async function logHabitEntry(
  _prevState: HabitLogActionState | null,
  formData: FormData,
): Promise<HabitLogActionState> {
  const raw = {
    habitId: String(formData.get("habitId") ?? ""),
    value: String(formData.get("value") ?? ""),
  };

  const result = logHabitEntrySchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] ? String(issue.path[0]) : "form";
      fieldErrors[field] = issue.message;
    }

    return {
      success: false,
      message: "Please fix the highlighted field(s).",
      fieldErrors,
    };
  }

  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const { prisma } = await import("@/lib/prisma");

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      message: "You need to be signed in to log a habit.",
      fieldErrors: {},
    };
  }

  const habit = await prisma.habit.findUnique({
    where: { id: result.data.habitId },
  });

  if (!habit || habit.userId !== session.user.id) {
    return {
      success: false,
      message: "You can only log your own habits.",
      fieldErrors: {},
    };
  }

  const date = new Date();
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

  if (habit.type === "BOOLEAN" && result.data.value !== true) {
    return {
      success: false,
      message: "Mark the habit as done before logging it.",
      fieldErrors: { value: "This habit is logged as done only." },
    };
  }

  if (habit.type === "MEASURABLE" && typeof result.data.value !== "number") {
    return {
      success: false,
      message: "Enter a value greater than zero.",
      fieldErrors: { value: "Enter a value greater than zero." },
    };
  }

  const entryValue = habit.type === "BOOLEAN" ? null : Number(result.data.value);

  try {
    await prisma.habitEntry.upsert({
      where: {
        habitId_date: {
          habitId: habit.id,
          date: utcDate,
        },
      },
      update: { value: entryValue },
      create: {
        habitId: habit.id,
        date: utcDate,
        value: entryValue,
      },
    });

    revalidatePath("/habits");

    return {
      success: true,
      message:
        habit.type === "BOOLEAN"
          ? `Logged “${habit.name}” for today.`
          : `Logged ${Number(result.data.value).toFixed(1).replace(/\.0$/, "")} ${habit.unit ?? "units"} for “${habit.name}”.`,
      fieldErrors: {},
    };
  } catch (error) {
    console.error("Failed to log habit entry", error);

    return {
      success: false,
      message: "Unable to log that habit right now.",
      fieldErrors: {},
    };
  }
}
