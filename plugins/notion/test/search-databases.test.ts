import { ToolDefinitionSchema } from "@choiceopen/atomemo-plugin-schema/schemas"
import { describe, expect, it } from "vitest"
import { searchDatabasesTool } from "../src/tools/search-databases"

describe("searchDatabasesTool", () => {
  it("should be a valid ToolDefinition according to ToolDefinitionSchema", () => {
    const result = ToolDefinitionSchema.safeParse(searchDatabasesTool)
    if (!result.success) {
      console.error(result.error.format())
    }

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("notion-search-databases")
      expect(result.data.parameters).toHaveLength(8)
    }
  })
})
