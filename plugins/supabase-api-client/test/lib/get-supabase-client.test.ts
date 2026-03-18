import { beforeEach, describe, expect, it, vi } from "vitest"

const mockCreateClient = vi.fn()

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}))

import {
  createSupabaseClient,
  getSupabaseClientFromArgs,
  MISSING_CREDENTIAL_ERROR_MESSAGE,
} from "../../src/lib/get-supabase-client"

beforeEach(() => {
  mockCreateClient.mockReturnValue({})
})

describe("getSupabaseClientFromArgs", () => {
  it("从有效 credentials 解析并创建客户端", () => {
    const params = { supabase_credential: "cred-1" }
    const credentials = {
      "cred-1": {
        supabase_url: "https://test.supabase.co",
        supabase_key: "anon-key-123",
      },
    }

    const result = getSupabaseClientFromArgs(params, credentials)
    expect(result.supabase).toBeDefined()
    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "anon-key-123",
    )
  })

  it("缺少 credential ID 时抛出错误", () => {
    const params = {}
    const credentials = {
      "cred-1": {
        supabase_url: "https://test.supabase.co",
        supabase_key: "anon-key-123",
      },
    }

    expect(() => getSupabaseClientFromArgs(params, credentials)).toThrow(
      MISSING_CREDENTIAL_ERROR_MESSAGE,
    )
  })

  it("credentials 中找不到对应 ID 时抛出错误", () => {
    const params = { supabase_credential: "cred-missing" }
    const credentials = {
      "cred-1": {
        supabase_url: "https://test.supabase.co",
        supabase_key: "anon-key-123",
      },
    }

    expect(() => getSupabaseClientFromArgs(params, credentials)).toThrow(
      MISSING_CREDENTIAL_ERROR_MESSAGE,
    )
  })

  it("credential 缺少 url 或 key 时抛出错误", () => {
    const params = { supabase_credential: "cred-1" }
    const credentials = {
      "cred-1": {
        supabase_url: "",
        supabase_key: "anon-key-123",
      },
    }

    expect(() => getSupabaseClientFromArgs(params, credentials)).toThrow(
      MISSING_CREDENTIAL_ERROR_MESSAGE,
    )
  })

  it("支持 InvokeArgsLike 格式 (parameters + credentials)", () => {
    const args = {
      parameters: { supabase_credential: "cred-1" },
      credentials: {
        "cred-1": {
          supabase_url: "https://test.supabase.co",
          supabase_key: "anon-key-123",
        },
      },
    }

    const result = getSupabaseClientFromArgs(args)
    expect(result.supabase).toBeDefined()
    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "anon-key-123",
    )
  })

  it("useServiceRoleKey 为 true 时使用 service_role_key", () => {
    const params = { supabase_credential: "cred-1" }
    const credentials = {
      "cred-1": {
        supabase_url: "https://test.supabase.co",
        supabase_key: "anon-key",
        supabase_service_role_key: "service-role-key",
      },
    }

    getSupabaseClientFromArgs(params, credentials, undefined, {
      useServiceRoleKey: true,
    })
    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "service-role-key",
    )
  })
})

describe("createSupabaseClient", () => {
  it("使用 trimmed url 和 key 创建客户端", () => {
    createSupabaseClient("  https://test.co  ", "  key123  ")
    expect(mockCreateClient).toHaveBeenCalledWith("https://test.co", "key123")
  })
})
