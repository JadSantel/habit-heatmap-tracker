"use server";

import { z } from "zod";

export const createHabitSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a habit name.").max(100, "Habit name must be 100 characters or fewer."),
    type: z.enum(["BOOLEAN", "MEASURABLE"]),
    unit: z.string().optional().nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.type !== "MEASURABLE") {
      return;
    }

    const trimmedUnit = value.unit?.trim() ?? "";

    if (!trimmedUnit) {
      ctx.addIssue({
        code: "custom",
        path: ["unit"],
        message: "A unit is required for measurable habits.",
      });
      return;
    }

    if (trimmedUnit.length > 50) {
      ctx.addIssue({
        code: "too_big",
        origin: "string",
        path: ["unit"],
        type: "string",
        maximum: 50,
        message: "Unit must be 50 characters or fewer.",
      });
    }
  })
  .transform((value) => ({
    ...value,
    name: value.name.trim(),
    unit: value.type === "MEASURABLE" ? (value.unit?.trim() ?? "") : null,
  }));

export type HabitActionState = {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string>;
};

export const initialHabitState: HabitActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

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
      message: `Created “${habit.name}”.`,
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
