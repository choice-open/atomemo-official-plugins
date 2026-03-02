import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseQueryTool } from "../../src/tools/supabase-query"

const mockQueryData = [{ id: "1", name: "e2e-a", score: 10 }]
let mockQueryError: { message: string; code?: string } | null = null

function createChain() {
  const chain = {
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    then(resolve: (v: { data: unknown; error: typeof mockQueryError }) => void) {
      return Promise.resolve({ data: mockQueryData, error: mockQueryError }).then(resolve)
    },
  }
  return chain
}

const mockFrom = vi.fn()
const mockSchema = vi.fn(function () {
  return {
    from: mockFrom,
  }
})

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

describe("supabase-query", () => {
  beforeEach(() => {
    mockQueryError = null
    mockSchema.mockClear()
    mockFrom.mockClear()
  })

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

  it("should call schema().from().select() and return data when credential provided", async () => {
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnValue(chain),
    })

    const result = await supabaseQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          columns: "*",
          schema: "public",
        },
        credentials: cred,
      },
    })

    expect(mockSchema).toHaveBeenCalledWith("public")
    expect(mockFrom).toHaveBeenCalledWith("e2e_test")
    expect(result).toMatchObject({
      success: true,
      data: mockQueryData,
      error: null,
    })
  })

  it("should apply filters object (eq) when filters is JSON object", async () => {
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnValue(chain),
    })

    await supabaseQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          filters: '{"name":"e2e-a"}',
        },
        credentials: cred,
      },
    })

    expect(chain.eq).toHaveBeenCalledWith("name", "e2e-a")
  })

  it("should apply filters array (gte) when filters is JSON array", async () => {
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnValue(chain),
    })

    await supabaseQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          filters: '[{"op":"gte","column":"score","value":15}]',
        },
        credentials: cred,
      },
    })

    expect(chain.gte).toHaveBeenCalledWith("score", 15)
  })

  it("should apply modifiers order_by and range (limit/offset)", async () => {
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnValue(chain),
    })

    await supabaseQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          order_by: "score.desc",
          limit: 10,
          offset: 0,
        },
        credentials: cred,
      },
    })

    expect(chain.order).toHaveBeenCalledWith("score", { ascending: false })
    expect(chain.range).toHaveBeenCalledWith(0, 9)
  })

  it("should return error when Supabase returns error", async () => {
    mockQueryError = { message: "relation \"missing\" does not exist", code: "42P01" }
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnValue(chain),
    })

    const result = await supabaseQueryTool.invoke({
      args: {
        parameters: { supabase_credential: CRED_ID, table: "missing" },
        credentials: cred,
      },
    })

    expect(result).toMatchObject({
      success: false,
      error: "relation \"missing\" does not exist",
      code: "42P01",
      data: null,
    })
  })
})
