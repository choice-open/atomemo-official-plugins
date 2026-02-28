import { describe, expect, it } from "vitest"
import { supabaseQueryTool } from "../../src/tools/supabase-query"

describe("supabase-query", () => {
  it("should return error when credential id is missing in parameters", async () => {
    const result = await supabaseQueryTool.invoke({
      args: {
        parameters: { table: "users" },
        credentials: {},
      },
    })
    expect(result).toMatchObject({
      success: false,
      error: "Missing Supabase credential (supabase_url or supabase_key).",
      data: null,
    })
  })

  it("should return error when credential id is not in credentials", async () => {
    const result = await supabaseQueryTool.invoke({
      args: {
        parameters: { supabase_credential: "some-id", table: "users" },
        credentials: {},
      },
    })
    expect(result).toMatchObject({
      success: false,
      error: "Missing Supabase credential (supabase_url or supabase_key).",
      data: null,
    })
  })
})
