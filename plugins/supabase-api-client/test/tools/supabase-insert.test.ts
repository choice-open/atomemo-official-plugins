import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockSupabaseClient } from "../helpers/mock-supabase"
import { supabaseInsertTool } from "../../src/tools/db/supabase-insert"

const mockCreateClient = vi.fn()

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}))

const CRED_ID = "cred-1"
const CREDENTIALS = {
  [CRED_ID]: {
    supabase_url: "https://test.supabase.co",
    supabase_key: "anon-key",
  },
}

beforeEach(() => {
  mockCreateClient.mockReturnValue(
    createMockSupabaseClient({ data: [{ id: 1 }], count: 1 }),
  )
})

describe("supabaseInsertTool", () => {
  it("invoke 成功插入单行", async () => {
    const result = await supabaseInsertTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "users",
          rows: '{"name": "test"}',
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result).toMatchObject({
      success: true,
      data: [{ id: 1 }],
      error: null,
    })
  })

  it("invoke 支持数组 rows", async () => {
    const result = await supabaseInsertTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "users",
          rows: '[{"name":"a"},{"name":"b"}]',
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result.success).toBe(true)
  })

  it("rows 非合法 JSON 时抛出错误", async () => {
    await expect(
      supabaseInsertTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            table: "users",
            rows: "invalid",
          },
          credentials: CREDENTIALS,
        },
      } as any),
    ).rejects.toThrow("valid JSON")
  })
})
