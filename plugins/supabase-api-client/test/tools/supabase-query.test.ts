import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockSupabaseClient } from "../helpers/mock-supabase"
import { supabaseQueryTool } from "../../src/tools/db/supabase-query"

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
  mockCreateClient.mockReturnValue(createMockSupabaseClient({ data: [{ id: 1 }] }))
})

describe("supabaseQueryTool", () => {
  it("工具定义包含 name 和 parameters", () => {
    expect(supabaseQueryTool.name).toBe("supabase-query")
    expect(supabaseQueryTool.parameters).toBeDefined()
    const credentialParam = supabaseQueryTool.parameters?.find(
      (p) => p.name === "supabase_credential",
    )
    expect(credentialParam?.required).toBe(true)
  })

  it("invoke 成功返回 data", async () => {
    const result = await supabaseQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "users",
          columns: "id,name",
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

  it("缺少 credential 时抛出错误", async () => {
    await expect(
      supabaseQueryTool.invoke({
        args: {
          parameters: { table: "users" },
          credentials: {},
        },
      } as any),
    ).rejects.toThrow()
  })

  it("支持 filters 参数", async () => {
    const result = await supabaseQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "users",
          filters: '{"id": 1}',
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result.success).toBe(true)
  })

  it("支持 return_mode single", async () => {
    mockCreateClient.mockReturnValue(
      createMockSupabaseClient({ data: [{ id: 1, name: "a" }] }),
    )
    const result = await supabaseQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "users",
          return_mode: "single",
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result.success).toBe(true)
    expect(result).toMatchObject({ data: { id: 1, name: "a" } })
  })
})
