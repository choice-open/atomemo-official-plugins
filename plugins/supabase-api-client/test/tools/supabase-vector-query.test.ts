import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockSupabaseClient } from "../helpers/mock-supabase"
import { supabaseVectorQueryTool } from "../../src/tools/vector/supabase-vector-query"

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
    createMockSupabaseClient({
      data: { matches: [{ id: "1", score: 0.9 }] },
    }),
  )
})

describe("supabaseVectorQueryTool", () => {
  it("invoke 成功查询向量", async () => {
    const result = await supabaseVectorQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          vector_bucket_name: "embeddings",
          index_name: "my-index",
          query_vector: '{"float32": [0.1, 0.2, 0.3]}',
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result).toMatchObject({ success: true, error: null })
  })

  it("vector_bucket_name 或 index_name 缺失时抛出错误", async () => {
    await expect(
      supabaseVectorQueryTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            vector_bucket_name: "",
            index_name: "idx",
            query_vector: "{}",
          },
          credentials: CREDENTIALS,
        },
      } as any),
    ).rejects.toThrow("vector_bucket_name")
  })
})
