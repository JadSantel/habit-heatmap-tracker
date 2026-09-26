import { z } from "zod";

export const logHabitEntrySchema = z.object({
  habitId: z.string().trim().min(1, "Habit not found."),
  value: z.union([
    z.literal("true").transform(() => true),
    z.literal("false").transform(() => false),
    z.coerce.number().refine((value) => Number.isFinite(value) && value > 0, "Enter a value greater than zero."),
  ]),
});

export type HabitLogActionState = {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string>;
};

export const initialHabitLogState: HabitLogActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};
