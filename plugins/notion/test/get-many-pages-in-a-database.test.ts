import { ToolDefinitionSchema } from "@choiceopen/atomemo-plugin-schema/schemas"
import { describe, expect, it } from "vitest"
import { getManyPagesInADatabaseTool } from "../src/tools/get-many-pages-in-a-database"

describe("getManyPagesInADatabaseTool", () => {
  it("should be a valid ToolDefinition according to ToolDefinitionSchema", () => {
    const result = ToolDefinitionSchema.safeParse(getManyPagesInADatabaseTool)
    if (!result.success) {
      console.error(result.error.format())
    }

    expect(result.success).toBe(true)
  })
})
