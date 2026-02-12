import { ToolDefinitionSchema } from "@choiceopen/atomemo-plugin-schema/schemas";
import { describe, expect, it } from "vitest";
import { appendBlocksTool } from "../src/tools/append-blocks";

describe("appendBlocksTool", () => {
  it("should be a valid ToolDefinition according to ToolDefinitionSchema", () => {
    const result = ToolDefinitionSchema.safeParse(appendBlocksTool);
    if (!result.success) {
      console.error(result.error.format());
    }

    expect(result.success).toBe(true);
  });
});
