import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createHabitSchema, deleteHabitSchema, updateHabitSchema } from "./habit-form-shared";
import { logHabitEntrySchema } from "./habit-log-shared";

describe("createHabitSchema", () => {
  it("accepts a valid boolean habit", () => {
    const result = createHabitSchema.parse({
      name: "Morning run",
      type: "BOOLEAN",
      unit: "",
    });

    assert.deepEqual(result, {
      name: "Morning run",
      type: "BOOLEAN",
      unit: null,
    });
  });

  it("requires a unit label for measurable habits", () => {
    assert.throws(() =>
      createHabitSchema.parse({
        name: "Read pages",
        type: "MEASURABLE",
        unit: "  ",
      }),
    );
  });

  it("rejects names over 100 characters", () => {
    assert.throws(() =>
      createHabitSchema.parse({
        name: "x".repeat(101),
        type: "BOOLEAN",
        unit: "",
      }),
    );
  });
});

describe("updateHabitSchema", () => {
  it("accepts a valid habit rename and preserves trimmed values", () => {
    const result = updateHabitSchema.parse({
      habitId: "habit_123",
      name: "  Morning run  ",
      type: "BOOLEAN",
      unit: "  ",
    });

    assert.deepEqual(result, {
      habitId: "habit_123",
      name: "Morning run",
      type: "BOOLEAN",
      unit: null,
    });
  });

  it("requires a unit for measurable habits during updates", () => {
    assert.throws(() =>
      updateHabitSchema.parse({
        habitId: "habit_123",
        name: "Read",
        type: "MEASURABLE",
        unit: "   ",
      }),
    );
  });
});

describe("logHabitEntrySchema", () => {
  it("accepts a boolean habit entry for today", () => {
    const result = logHabitEntrySchema.parse({
      habitId: "habit_123",
      value: "true",
    });

    assert.deepEqual(result, {
      habitId: "habit_123",
      value: true,
    });
  });

  it("rejects a false boolean value before it reaches the database", () => {
    assert.throws(() =>
      logHabitEntrySchema.parse({
        habitId: "habit_123",
        value: "false",
      }),
    );
  });

  it("accepts a measurable habit value above zero", () => {
    const result = logHabitEntrySchema.parse({
      habitId: "habit_123",
      value: "15.5",
    });

    assert.deepEqual(result, {
      habitId: "habit_123",
      value: 15.5,
    });
  });

  it("rejects measurable values that are zero or negative", () => {
    assert.throws(() =>
      logHabitEntrySchema.parse({
        habitId: "habit_123",
        value: "0",
      }),
    );
  });
});

describe("deleteHabitSchema", () => {
  it("requires a non-empty habit identifier", () => {
    assert.throws(() => deleteHabitSchema.parse({ habitId: "   " }));
  });
});
