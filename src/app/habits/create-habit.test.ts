import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createHabitSchema } from "./create-habit-action";

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
