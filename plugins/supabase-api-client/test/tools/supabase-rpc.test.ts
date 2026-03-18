import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockSupabaseClient } from "../helpers/mock-supabase"
import { supabaseRpcTool } from "../../src/tools/db/supabase-rpc"

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
    createMockSupabaseClient({ data: { result: "ok" } }),
  )
})

describe("supabaseRpcTool", () => {
  it("invoke 成功调用 RPC", async () => {
    const result = await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "my_func",
          args: '{"x": 1}',
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result).toMatchObject({
      success: true,
      data: { result: "ok" },
      error: null,
    })
  })

  it("支持空 args", async () => {
    const result = await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "no_arg_func",
          args: "",
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result.success).toBe(true)
  })
})
