import { ToolDefinitionSchema } from "@choiceopen/atomemo-plugin-schema/schemas";
import { describe, expect, it } from "vitest";
import { createAPageInADatabaseTool } from "../src/tools/create-a-page-in-a-database";

describe("createAPageInADatabaseTool", () => {
  it("should be a valid ToolDefinition according to ToolDefinitionSchema", () => {
    const result = ToolDefinitionSchema.safeParse(createAPageInADatabaseTool);
    if (!result.success) {
      console.error(result.error.format());
    }

    expect(result.success).toBe(true);
  });
});
