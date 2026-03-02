import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseUpdateTool } from "../../src/tools/supabase-update"

const mockUpdateData = [{ id: "1", name: "e2e-a", score: 11 }]
let mockUpdateError: { message: string; code?: string } | null = null

function createChain() {
  const chain = {
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    then(
      resolve: (v: { data: unknown; error: typeof mockUpdateError }) => void,
    ) {
      return Promise.resolve({
        data: mockUpdateData,
        error: mockUpdateError,
      }).then(resolve)
    },
    select: vi
      .fn()
      .mockResolvedValue({ data: mockUpdateData, error: mockUpdateError }),
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

describe("supabase-update", () => {
  beforeEach(() => {
    mockUpdateError = null
    mockSchema.mockClear()
    mockFrom.mockClear()
  })

  it("should return error when credential is missing", async () => {
    const result = await supabaseUpdateTool.invoke({
      args: {
        parameters: {
          table: "e2e_test",
          values: "{}",
          filters: "{}",
        },
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

  it("should return error when values is empty object", async () => {
    const result = await supabaseUpdateTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          values: "{}",
          filters: '{"id":1}',
        },
        credentials: cred,
      },
    })
    expect(result).toMatchObject({
      success: false,
      error: "Parameter 'values' must be a non-empty JSON object.",
      data: null,
    })
  })

  it("should return error when filters is missing or empty", async () => {
    const result = await supabaseUpdateTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          values: '{"score":11}',
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

  it("should call schema().from().update() with filters and return data", async () => {
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      update: vi.fn().mockReturnValue(chain),
    })

    const result = await supabaseUpdateTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          values: '{"score":11}',
          filters: '{"name":"e2e-a"}',
          returning: "representation",
        },
        credentials: cred,
      },
    })

    expect(mockSchema).toHaveBeenCalledWith("public")
    expect(mockFrom).toHaveBeenCalledWith("e2e_test")
    const updateFn = mockFrom.mock.results[0]?.value?.update
    expect(updateFn).toHaveBeenCalledWith({ score: 11 })
    expect(chain.eq).toHaveBeenCalledWith("name", "e2e-a")
    expect(chain.select).toHaveBeenCalled()
    expect(result).toMatchObject({
      success: true,
      data: mockUpdateData,
      error: null,
    })
  })

  it("should return error when Supabase update returns error", async () => {
    mockUpdateError = { message: "row not found", code: "PGRST116" }
    const chain = createChain()
    mockFrom.mockReturnValueOnce({
      update: vi.fn().mockReturnValue(chain),
    })

    const result = await supabaseUpdateTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          values: '{"score":11}',
          filters: '{"name":"e2e-a"}',
        },
        credentials: cred,
      },
    })

    expect(result).toMatchObject({
      success: false,
      error: "row not found",
      code: "PGRST116",
      data: null,
    })
  })
})
