import { beforeEach, describe, expect, it, vi, type Mock } from "vitest"

// Mock package.json before any import that might use it
vi.mock("../package.json", () => ({
  default: { name: "supabase-api-client", version: "0.1.0" },
}))

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    addCredential: vi.fn(),
    run: vi.fn(),
  }),
}))

// Mock i18n
vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key, zh_Hans: key })),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US", "zh-Hans"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue(undefined),
}))

// Mock Supabase client: default auth methods return success
const mockSignOut = vi.fn().mockResolvedValue({ error: null })
const mockGetSession = vi.fn().mockResolvedValue({
  data: { session: { access_token: "token", refresh_token: "refresh" } },
  error: null,
})

// Query chain: schema().from().select() -> order().range() -> thenable
let mockQueryData: unknown[] = [{ id: 1, name: "a" }]
let mockQueryError: { message: string; code?: string } | null = null
let lastQueryChain: { eq: ReturnType<typeof vi.fn>; order: ReturnType<typeof vi.fn>; range: ReturnType<typeof vi.fn> } | null = null
const mockSchema = vi.fn(function (_name: string) {
  return {
    from: vi.fn(function (_table: string) {
      return {
        select: vi.fn(function (_columns: string) {
          const chain = {
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            then(resolve: (v: { data: unknown; error: typeof mockQueryError }) => void) {
              return Promise.resolve({ data: mockQueryData, error: mockQueryError }).then(resolve)
            },
          }
          lastQueryChain = chain
          return chain
        }),
      }
    }),
  }
})

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signOut: mockSignOut,
      getSession: mockGetSession,
    },
    schema: mockSchema,
  })),
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { supabaseCredential } from "../src/credentials/supabase-connection"
import { supabaseAuthSignOutTool } from "../src/tools/supabase-auth-sign-out"
import { supabaseAuthGetSessionTool } from "../src/tools/supabase-auth-get-session"
import { supabaseQueryTool } from "../src/tools/supabase-query"
import { authResult, parseJson } from "../src/lib/auth-result"

const TOOL_COUNT = 28 // 6 db + 22 auth

describe("supabase-api-client plugin", () => {
  describe("plugin initialization", () => {
    it("should create plugin and register one credential", async () => {
      const addCredential = vi.fn()
      const addTool = vi.fn()
      const run = vi.fn()
      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addTool,
        addCredential,
        run,
      })

      await import("../src/index")

      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledTimes(1)
      expect(addCredential).toHaveBeenCalledWith(supabaseCredential)
      expect(addTool).toHaveBeenCalledTimes(TOOL_COUNT)
      expect(run).toHaveBeenCalled()
    })

    it("should register all expected tools in order", async () => {
      const addTool = vi.fn()
      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addTool,
        addCredential: vi.fn(),
        run: vi.fn(),
      })
      vi.resetModules()
      await import("../src/index")

      expect(addTool).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: "supabase-query" }))
      expect(addTool).toHaveBeenCalledWith(expect.objectContaining({ name: "supabase-auth-sign-out" }))
      expect(addTool).toHaveBeenCalledWith(expect.objectContaining({ name: "supabase-auth-get-session" }))
    })
  })

  describe("supabase credential", () => {
    it("should have name and parameters", () => {
      expect(supabaseCredential).toMatchObject({
        name: "supabase-connection",
        parameters: expect.arrayContaining([
          expect.objectContaining({ name: "supabase_url", type: "string", required: true }),
          expect.objectContaining({ name: "supabase_key", type: "string", required: true }),
        ]),
      })
      expect(supabaseCredential.parameters).toHaveLength(2)
    })
  })

  describe("supabase-auth-sign-out tool", () => {
    it("should have correct name and parameters", () => {
      expect(supabaseAuthSignOutTool.name).toBe("supabase-auth-sign-out")
      expect(supabaseAuthSignOutTool.parameters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "supabase_credential",
            type: "credential_id",
            credential_name: "supabase-connection",
          }),
          expect.objectContaining({ name: "scope", type: "string" }),
        ]),
      )
    })

    it("should return error when credential is missing", async () => {
      const result = await supabaseAuthSignOutTool.invoke({
        args: {
          parameters: { scope: "local" },
          credentials: {},
        },
      })

      expect(result).toEqual({
        success: false,
        error: "Missing Supabase credential (supabase_url or supabase_key).",
        data: null,
        code: null,
      })
    })

    it("should call signOut and return success when credential is provided", async () => {
      const result = await supabaseAuthSignOutTool.invoke({
        args: {
          parameters: { scope: "local" },
          credentials: {
            supabase_credential: {
              supabase_url: "https://xxx.supabase.co",
              supabase_key: "anon-key",
            },
          },
        },
      })

      expect(mockSignOut).toHaveBeenCalledWith({ scope: "local" })
      expect(result).toEqual({
        success: true,
        data: null,
        error: null,
        code: null,
      })
    })
  })

  describe("supabase-query tool", () => {
    const cred = {
      supabase_credential: {
        supabase_url: "https://xxx.supabase.co",
        supabase_key: "anon-key",
      },
    } as const

    beforeEach(() => {
      mockQueryData = [{ id: 1, name: "a" }]
      mockQueryError = null
      mockSchema.mockClear()
    })

    it("should have correct name and parameters", () => {
      expect(supabaseQueryTool.name).toBe("supabase-query")
      const paramNames = supabaseQueryTool.parameters.map((p) => p.name)
      expect(paramNames).toContain("supabase_credential")
      expect(paramNames).toContain("table")
      expect(paramNames).toContain("columns")
      expect(paramNames).toContain("schema")
      expect(paramNames).toContain("filters")
      expect(paramNames).toContain("order_by")
      expect(paramNames).toContain("limit")
      expect(paramNames).toContain("offset")
      expect(paramNames).toContain("return_mode")
      expect(paramNames).toContain("return_format")
      expect(paramNames).toContain("explain")
    })

    it("should return error when credential is missing", async () => {
      const result = await supabaseQueryTool.invoke({
        args: {
          parameters: { table: "users" },
          credentials: {},
        },
      })

      expect(result).toEqual({
        success: false,
        error: "Missing Supabase credential (supabase_url or supabase_key).",
        data: null,
        code: null,
      })
      expect(mockSchema).not.toHaveBeenCalled()
    })

    it("should call schema().from().select() and return data when credential is provided", async () => {
      const result = await supabaseQueryTool.invoke({
        args: {
          parameters: {
            supabase_credential: "supabase_credential",
            table: "users",
            columns: "id,name",
            schema: "public",
            limit: 10,
            offset: 0,
          },
          credentials: cred,
        },
      })

      expect(mockSchema).toHaveBeenCalledWith("public")
      const fromFn = mockSchema.mock.results[0]?.value?.from
      expect(fromFn).toHaveBeenCalledWith("users")
      const selectFn = fromFn.mock.results[0]?.value?.select
      expect(selectFn).toHaveBeenCalledWith("id,name")

      expect(result).toMatchObject({
        success: true,
        data: [{ id: 1, name: "a" }],
        error: null,
        code: null,
      })
    })

    it("should use default columns and schema when omitted", async () => {
      await supabaseQueryTool.invoke({
        args: {
          parameters: { supabase_credential: "supabase_credential", table: "posts" },
          credentials: cred,
        },
      })

      expect(mockSchema).toHaveBeenCalledWith("public")
      const selectFn = mockSchema.mock.results[0]?.value?.from.mock.results[0]?.value?.select
      expect(selectFn).toHaveBeenCalledWith("*")
    })

    it("should return error when Supabase returns error", async () => {
      mockQueryError = { message: "relation \"missing\" does not exist", code: "42P01" }

      const result = await supabaseQueryTool.invoke({
        args: {
          parameters: { supabase_credential: "supabase_credential", table: "missing" },
          credentials: cred,
        },
      })

      expect(result).toEqual({
        success: false,
        error: "relation \"missing\" does not exist",
        code: "42P01",
        data: null,
      })
    })

    it("should apply filters when filters parameter is valid JSON object", async () => {
      const result = await supabaseQueryTool.invoke({
        args: {
          parameters: {
            supabase_credential: "supabase_credential",
            table: "users",
            filters: '{"status": "active"}',
          },
          credentials: cred,
        },
      })

      expect(result.success).toBe(true)
      expect(lastQueryChain?.eq).toHaveBeenCalledWith("status", "active")
    })
  })

  describe("supabase-auth-get-session tool", () => {
    it("should return error when credential is missing", async () => {
      const result = await supabaseAuthGetSessionTool.invoke({
        args: { parameters: {}, credentials: {} },
      })

      expect(result).toEqual({
        success: false,
        error: "Missing Supabase credential (supabase_url or supabase_key).",
        data: null,
        code: null,
      })
    })

    it("should return session data when credential is provided", async () => {
      const result = await supabaseAuthGetSessionTool.invoke({
        args: {
          parameters: {},
          credentials: {
            supabase_credential: {
              supabase_url: "https://xxx.supabase.co",
              supabase_key: "anon-key",
            },
          },
        },
      })

      expect(mockGetSession).toHaveBeenCalled()
      expect(result).toMatchObject({
        success: true,
        data: expect.objectContaining({
          session: expect.objectContaining({ access_token: "token", refresh_token: "refresh" }),
        }),
        error: null,
        code: null,
      })
    })
  })

  describe("auth-result helper", () => {
    it("should return success when error is null", () => {
      expect(authResult({ data: { foo: 1 }, error: null })).toEqual({
        success: true,
        data: { foo: 1 },
        error: null,
        code: null,
      })
    })

    it("should return failure when error is set", () => {
      expect(
        authResult({
          data: null,
          error: { message: "Bad request", code: "400" },
        }),
      ).toEqual({
        success: false,
        data: null,
        error: "Bad request",
        code: "400",
      })
    })
  })

  describe("parseJson helper", () => {
    it("should return parsed object for valid JSON", () => {
      expect(parseJson('{"a":1}', {})).toEqual({ a: 1 })
    })

    it("should return fallback for empty or invalid JSON", () => {
      expect(parseJson("", [])).toEqual([])
      expect(parseJson(undefined, null)).toBe(null)
      expect(parseJson("not json", { x: 1 })).toEqual({ x: 1 })
    })
  })
})
