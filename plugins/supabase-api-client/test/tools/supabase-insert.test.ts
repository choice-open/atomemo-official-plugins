import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseInsertTool } from "../../src/tools/supabase-insert"

const mockInsertData = [{ id: "1", name: "e2e-a", score: 10 }]
let mockInsertError: { message: string; code?: string } | null = null

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

describe("supabase-insert", () => {
  beforeEach(() => {
    mockInsertError = null
    mockSchema.mockClear()
    mockFrom.mockClear()
  })

  it("should return error when credential is missing", async () => {
    const result = await supabaseInsertTool.invoke({
      args: {
        parameters: { table: "e2e_test", rows: "[]" },
        credentials: {},
      },
    })
    expect(result).toMatchObject({
      success: false,
      error: "Missing Supabase credential (supabase_url or supabase_key).",
      data: null,
      count: null,
    })
    expect(mockSchema).not.toHaveBeenCalled()
  })

  it("should return error when rows is invalid JSON", async () => {
    const result = await supabaseInsertTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          rows: "not json",
        },
        credentials: cred,
      },
    })
    expect(result).toMatchObject({
      success: false,
      error: "Parameter 'rows' must be a valid JSON array or object.",
      data: null,
      count: null,
    })
  })

  it("should call schema().from().insert() and return data when credential and rows provided", async () => {
    const insertReturn = {
      select: vi.fn().mockResolvedValue({
        data: mockInsertData,
        error: mockInsertError,
      }),
      then(
        resolve: (v: {
          data: unknown
          error: typeof mockInsertError
          count?: number
        }) => void,
      ) {
        return Promise.resolve({
          data: mockInsertData,
          error: mockInsertError,
          count: 2,
        }).then(resolve)
      },
    }
    mockFrom.mockReturnValueOnce({
      insert: vi.fn().mockReturnValue(insertReturn),
    })

    const result = await supabaseInsertTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          rows: JSON.stringify([
            { name: "e2e-a", score: 10 },
            { name: "e2e-b", score: 20 },
          ]),
          returning: "representation",
        },
        credentials: cred,
      },
    })

    expect(mockSchema).toHaveBeenCalledWith("public")
    expect(mockFrom).toHaveBeenCalledWith("e2e_test")
    const insertFn = mockFrom.mock.results[0]?.value?.insert
    expect(insertFn).toHaveBeenCalledWith(
      [
        { name: "e2e-a", score: 10 },
        { name: "e2e-b", score: 20 },
      ],
      { count: "exact" },
    )
    expect(result).toMatchObject({
      success: true,
      data: mockInsertData,
      error: null,
      count: 2,
    })
  })

  it("should return error when Supabase insert returns error", async () => {
    mockInsertError = { message: "duplicate key", code: "23505" }
    const insertReturn = {
      select: vi.fn().mockResolvedValue({
        data: null,
        error: mockInsertError,
      }),
      then(
        resolve: (v: { data: unknown; error: typeof mockInsertError }) => void,
      ) {
        return Promise.resolve({ data: null, error: mockInsertError }).then(
          resolve,
        )
      },
    }
    mockFrom.mockReturnValueOnce({
      insert: vi.fn().mockReturnValue(insertReturn),
    })

    const result = await supabaseInsertTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "e2e_test",
          rows: JSON.stringify([{ name: "dup" }]),
        },
        credentials: cred,
      },
    })

    expect(result).toMatchObject({
      success: false,
      error: "duplicate key",
      code: "23505",
      data: null,
      count: null,
    })
  })
})
