import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockSupabaseClient } from "../helpers/mock-supabase"
import { supabaseUpdateTool } from "../../src/tools/db/supabase-update"

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
    createMockSupabaseClient({ data: [{ id: 1 }] }),
  )
})

describe("supabaseUpdateTool", () => {
  it("invoke 成功更新", async () => {
    const result = await supabaseUpdateTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "users",
          values: '{"name": "updated"}',
          filters: '{"id": 1}',
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result).toMatchObject({ success: true, error: null })
  })

  it("values 为空对象时抛出错误", async () => {
    await expect(
      supabaseUpdateTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            table: "users",
            values: '{}',
            filters: '{"id": 1}',
          },
          credentials: CREDENTIALS,
        },
      } as any),
    ).rejects.toThrow("non-empty JSON object")
  })

  it("filters 缺失时抛出错误", async () => {
    await expect(
      supabaseUpdateTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            table: "users",
            values: '{"name":"x"}',
            filters: '{}',
          },
          credentials: CREDENTIALS,
        },
      } as any),
    ).rejects.toThrow("filters")
  })
})
