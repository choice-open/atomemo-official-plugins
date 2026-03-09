import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseRpcTool } from "../../src/tools/db/supabase-rpc"

const mockRpcData = { result: 42 }
let mockRpcError: { message: string; code?: string } | null = null

const mockRpc = vi.fn(() =>
  Promise.resolve({ data: mockRpcData, error: mockRpcError }),
)
const mockSchema = vi.fn(() => ({ rpc: mockRpc }))

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

describe("supabase-rpc", () => {
  beforeEach(() => {
    mockRpcError = null
    mockSchema.mockClear()
    mockRpc.mockClear()
    mockRpc.mockImplementation(() =>
      Promise.resolve({ data: mockRpcData, error: mockRpcError }),
    )
  })

  it("should return error when credential is missing in parameters", async () => {
    const result = await supabaseRpcTool.invoke({
      args: {
        parameters: { function_name: "get_count" },
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

  it("should return error when credential id is not in credentials", async () => {
    const result = await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: "some-id",
          function_name: "get_count",
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

  it("should return error when credential has no supabase_url", async () => {
    const result = await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "get_count",
        },
        credentials: {
          [CRED_ID]: { supabase_key: "key" },
        },
      },
    })
    expect(result).toMatchObject({
      success: false,
      error: "Missing Supabase credential (supabase_url or supabase_key).",
      data: null,
    })
  })

  it("should call schema(public).rpc(functionName) with no args and return data", async () => {
    const result = await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "get_e2e_test_count",
          schema: "public",
        },
        credentials: cred,
      },
    })

    expect(mockSchema).toHaveBeenCalledWith("public")
    expect(mockRpc).toHaveBeenCalledWith("get_e2e_test_count", undefined)
    expect(result).toMatchObject({
      success: true,
      data: mockRpcData,
      error: null,
    })
  })

  it("should use default schema public when schema omitted", async () => {
    await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "my_func",
        },
        credentials: cred,
      },
    })
    expect(mockSchema).toHaveBeenCalledWith("public")
    expect(mockRpc).toHaveBeenCalledWith("my_func", undefined)
  })

  it("should call rpc with parsed args when args is valid JSON", async () => {
    await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "echo",
          args: JSON.stringify({ msg: "hello" }),
          schema: "public",
        },
        credentials: cred,
      },
    })
    expect(mockRpc).toHaveBeenCalledWith("echo", { msg: "hello" })
  })

  it("should call rpc with undefined when args is empty string", async () => {
    await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "no_args_fn",
          args: "",
        },
        credentials: cred,
      },
    })
    expect(mockRpc).toHaveBeenCalledWith("no_args_fn", undefined)
  })

  it("should call rpc with undefined when args is empty object JSON", async () => {
    await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "fn",
          args: "{}",
        },
        credentials: cred,
      },
    })
    expect(mockRpc).toHaveBeenCalledWith("fn", undefined)
  })

  it("should return success false and error when Supabase rpc returns error", async () => {
    mockRpcError = { message: "function not found", code: "PGRST202" }
    mockRpc.mockResolvedValueOnce({ data: null, error: mockRpcError })

    const result = await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "missing_fn",
        },
        credentials: cred,
      },
    })

    expect(result).toMatchObject({
      success: false,
      error: "function not found",
      code: "PGRST202",
      data: null,
    })
  })

  it("should use custom schema when provided", async () => {
    await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "my_schema.my_func",
          schema: "my_schema",
        },
        credentials: cred,
      },
    })
    expect(mockSchema).toHaveBeenCalledWith("my_schema")
    expect(mockRpc).toHaveBeenCalledWith("my_schema.my_func", undefined)
  })

  it("should treat invalid args JSON as empty object and call rpc with undefined", async () => {
    await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "fn",
          args: "not json",
        },
        credentials: cred,
      },
    })
    expect(mockRpc).toHaveBeenCalledWith("fn", undefined)
  })
})
