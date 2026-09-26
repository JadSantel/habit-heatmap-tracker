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