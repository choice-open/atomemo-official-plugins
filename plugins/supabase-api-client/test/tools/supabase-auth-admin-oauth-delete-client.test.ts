import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseAuthAdminOAuthDeleteClientTool } from "../../src/tools/auth/admin-oauth/supabase-auth-admin-oauth-delete-client"

const mockDeleteClient = vi.fn()

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      admin: {
        oauth: {
          deleteClient: (id: string) => mockDeleteClient(id),
        },
      },
    },
  }),
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
  mockDeleteClient.mockResolvedValue({ error: null })
})

describe("supabaseAuthAdminOAuthDeleteClientTool", () => {
  it("工具定义完整", () => {
    expect(supabaseAuthAdminOAuthDeleteClientTool.name).toBe(
      "supabase-auth-admin-oauth-delete-client",
    )
    expect(supabaseAuthAdminOAuthDeleteClientTool.invoke).toBeInstanceOf(Function)
  })

  it("invoke 成功删除 OAuth 客户端", async () => {
    const result = await supabaseAuthAdminOAuthDeleteClientTool.invoke({
      args: {
        parameters: { supabase_credential: CRED_ID, client_id: "client-123" },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result).toMatchObject({ success: true, data: null, error: null })
    expect(mockDeleteClient).toHaveBeenCalledWith("client-123")
  })

  it("client_id 为空时抛出错误", async () => {
    await expect(
      supabaseAuthAdminOAuthDeleteClientTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, client_id: "" },
          credentials: CREDENTIALS,
        },
      } as any),
    ).rejects.toThrow("client_id is required.")
  })

  it("client_id 仅有空格时抛出错误", async () => {
    await expect(
      supabaseAuthAdminOAuthDeleteClientTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, client_id: "   " },
          credentials: CREDENTIALS,
        },
      } as any),
    ).rejects.toThrow("client_id is required.")
  })

  it("API 返回 error 时抛出错误", async () => {
    mockDeleteClient.mockResolvedValueOnce({
      error: { message: "Client not found", code: "404" },
    })

    await expect(
      supabaseAuthAdminOAuthDeleteClientTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, client_id: "missing" },
          credentials: CREDENTIALS,
        },
      } as any),
    ).rejects.toMatchObject({ message: "Client not found", code: "404" })
  })
})
