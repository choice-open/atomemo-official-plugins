import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseDeleteTool } from "../../src/tools/supabase-delete"

let mockDeleteError: { message: string; code?: string } | null = null

function createChain() {
  const chain = {
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    then(
      resolve: (v: { data: unknown; error: typeof mockDeleteError }) => void,
    ) {
      return Promise.resolve({ data: null, error: mockDeleteError }).then(
        resolve,
      )
    },
    select: vi.fn().mockResolvedValue({ data: [], error: mockDeleteError }),
  }
  return chain
}

const mockFrom = vi.fn()
const mockSchema = vi.fn(() => ({ from: mockFrom }))

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    schema: mockSchema,
  })),
}))

const CRED_ID = "cred"
const cred = {
  [CRED_ID]: {
    supabase_url: "https://xxx.supabase.co",
    supabase_key: "test-key",
  },
}

describe("supabase-delete", () => {
  beforeEach(() => {
    mockDeleteError = null
    mockSchema.mockClear()
    mockFrom.mockClear()
  })

  it("should return error when credential is missing", async () => {
    const result = await supabaseDeleteTool.invoke({
      args: {
        parameters: { table: "e2e_test", filters: "{}" },
        credentials: {},
      },
    })
    expect(result).toMatchObject({
      success: false,
      error: "Missing Supabase credential (supabase_url or supabase_key).",
      data: null,
    })
    expect(mockSchema).not.toHaveBeenCalled()
  })

  it("should return error when filters is missing or empty", async () => {
    const result = await supabaseDeleteTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          filters: "{}",
        },
        credentials: cred,
      },
    })
    expect(result).toMatchObject({
      success: false,
      error: expect.stringContaining("filters"),
      data: null,
    })
  })

  it("should call schema().from().delete() with filters and return success", async () => {
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      delete: vi.fn().mockReturnValue(chain),
    })

    const result = await supabaseDeleteTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          filters: '{"name":"e2e-b"}',
          returning: "representation",
        },
        credentials: cred,
      },
    })

    expect(mockSchema).toHaveBeenCalledWith("public")
    expect(mockFrom).toHaveBeenCalledWith("e2e_test")
    expect(chain.eq).toHaveBeenCalledWith("name", "e2e-b")
    expect(chain.select).toHaveBeenCalled()
    expect(result).toMatchObject({
      success: true,
      data: [],
      error: null,
    })
  })

  it("should apply filters array (gte) when filters is JSON array", async () => {
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      delete: vi.fn().mockReturnValue(chain),
    })

    await supabaseDeleteTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          filters: '[{"op":"gte","column":"score","value":100}]',
        },
        credentials: cred,
      },
    })

    expect(chain.gte).toHaveBeenCalledWith("score", 100)
  })

  it("should return error when Supabase delete returns error", async () => {
    mockDeleteError = { message: "permission denied", code: "42501" }
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      delete: vi.fn().mockReturnValue(chain),
    })

    const result = await supabaseDeleteTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          filters: '{"id":1}',
        },
        credentials: cred,
      },
    })

    expect(result).toMatchObject({
      success: false,
      error: "permission denied",
      code: "42501",
      data: null,
    })
  })
})
