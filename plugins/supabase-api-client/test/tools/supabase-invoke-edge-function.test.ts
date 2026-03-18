import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockSupabaseClient } from "../helpers/mock-supabase"
import { supabaseInvokeEdgeFunctionTool } from "../../src/tools/edge/supabase-invoke-edge-function"

const mockCreateClient = vi.fn()

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}))

const CRED_ID = "cred-1"
const CREDENTIALS = {
  [CRED_ID]: {
    supabase_url: "https://test.supabase.co",
    supabase_key: "anon-key",
    supabase_service_role_key: "service-role-key",
  },
}

beforeEach(() => {
  mockCreateClient.mockReturnValue(
    createMockSupabaseClient({ data: { message: "hello" } }),
  )
})

describe("supabaseInvokeEdgeFunctionTool", () => {
  it("invoke 成功调用 Edge Function", async () => {
    const result = await supabaseInvokeEdgeFunctionTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "hello-world",
          body: '{"name": "test"}',
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result).toMatchObject({
      success: true,
      data: { message: "hello" },
      error: null,
    })
  })

  it("function_name 为空时抛出错误", async () => {
    await expect(
      supabaseInvokeEdgeFunctionTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            function_name: "",
          },
          credentials: CREDENTIALS,
        },
      } as any),
    ).rejects.toThrow("function_name")
  })
})
