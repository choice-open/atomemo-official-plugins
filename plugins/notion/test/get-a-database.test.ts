import { ToolDefinitionSchema } from "@choiceopen/atomemo-plugin-schema/schemas";
import { describe, expect, it } from "vitest";
import { getADatabaseTool } from "../src/tools/get-a-database";

describe("getADatabaseTool", () => {
  it("should be a valid ToolDefinition according to ToolDefinitionSchema", () => {
    const result = ToolDefinitionSchema.safeParse(getADatabaseTool);
    if (!result.success) {
      console.error(result.error.format());
    }

    expect(result.success).toBe(true);
  });
});
