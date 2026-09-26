"use server";

import { createHabitSchema, deleteHabitSchema, updateHabitSchema, type HabitActionState } from "./habit-form-shared";

export async function createHabit(
  _prevState: HabitActionState | null,
  formData: FormData,
): Promise<HabitActionState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? ""),
    unit: String(formData.get("unit") ?? ""),
  };

  const result = createHabitSchema.safeParse(raw);

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
  const { revalidatePath } = await import("next/cache");
  const { prisma } = await import("@/lib/prisma");

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      message: "You need to be signed in to create a habit.",
      fieldErrors: {},
    };
  }

  try {
    const habit = await prisma.habit.create({
      data: {
        userId: session.user.id,
        name: result.data.name,
        type: result.data.type,
        unit: result.data.unit,
      },
    });

    revalidatePath("/habits");

    return {
      success: true,
      message: `Created "${habit.name}".`,
      fieldErrors: {},
    };
  } catch (error) {
    console.error("Failed to create habit", error);

    return {
      success: false,
      message: "Unable to create your habit right now.",
      fieldErrors: {},
    };
  }
}

export async function updateHabit(
  _prevState: HabitActionState | null,
  formData: FormData,
): Promise<HabitActionState> {
  const raw = {
    habitId: String(formData.get("habitId") ?? ""),
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? ""),
    unit: String(formData.get("unit") ?? ""),
  };

  const result = updateHabitSchema.safeParse(raw);

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
  const { revalidatePath } = await import("next/cache");
  const { prisma } = await import("@/lib/prisma");

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      message: "You need to be signed in to update a habit.",
      fieldErrors: {},
    };
  }

  const habit = await prisma.habit.findUnique({
    where: { id: result.data.habitId },
  });

  if (!habit || habit.userId !== session.user.id) {
    return {
      success: false,
      message: "You can only update your own habits.",
      fieldErrors: {},
    };
  }

  if (result.data.type !== habit.type) {
    return {
      success: false,
      message: "Habit type cannot be changed while editing.",
      fieldErrors: {},
    };
  }

  try {
    const updatedHabit = await prisma.habit.update({
      where: { id: habit.id },
      data: {
        name: result.data.name,
        unit: result.data.unit,
      },
    });

    revalidatePath("/habits");

    return {
      success: true,
      message: `Updated "${updatedHabit.name}".`,
      fieldErrors: {},
    };
  } catch (error) {
    console.error("Failed to update habit", error);

    return {
      success: false,
      message: "Unable to update your habit right now.",
      fieldErrors: {},
    };
  }
}

export async function deleteHabit(formData: FormData) {
  const raw = {
    habitId: String(formData.get("habitId") ?? ""),
  };

  const result = deleteHabitSchema.safeParse(raw);

  if (!result.success) {
    return;
  }

  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const { revalidatePath } = await import("next/cache");
  const { prisma } = await import("@/lib/prisma");

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return;
  }

  const habit = await prisma.habit.findUnique({
    where: { id: result.data.habitId },
  });

  if (!habit || habit.userId !== session.user.id) {
    return;
  }

  await prisma.habit.delete({
    where: { id: habit.id },
  });

  revalidatePath("/habits");
}