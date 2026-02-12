import { ToolDefinitionSchema } from "@choiceopen/atomemo-plugin-schema/schemas";
import { describe, expect, it } from "vitest";
import { updateAPageInADatabaseTool } from "../src/tools/update-a-page-in-a-database";

describe("updateAPageInADatabaseTool", () => {
  it("should be a valid ToolDefinition according to ToolDefinitionSchema", () => {
    const result = ToolDefinitionSchema.safeParse(updateAPageInADatabaseTool);
    if (!result.success) {
      console.error(result.error.format());
    }

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("notion-update-page-in-database");
      expect(result.data.parameters).toHaveLength(5);
    }
  });
});
