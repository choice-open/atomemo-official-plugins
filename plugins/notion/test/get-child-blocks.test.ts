import { ToolDefinitionSchema } from "@choiceopen/atomemo-plugin-schema/schemas";
import { describe, expect, it } from "vitest";
import { getChildBlocksTool } from "../src/tools/get-child-blocks";

describe("getChildBlocksTool", () => {
  it("should be a valid ToolDefinition according to ToolDefinitionSchema", () => {
    const result = ToolDefinitionSchema.safeParse(getChildBlocksTool);
    if (!result.success) {
      console.error(result.error.format());
    }

    expect(result.success).toBe(true);
  });
});
