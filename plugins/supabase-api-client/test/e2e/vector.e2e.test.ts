/**
 * Vector E2E 测试 - 需要 Supabase Vector 扩展和已创建的 vector bucket/index
 * 设置 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY 环境变量
 */
import { describe, expect, it } from "vitest"
import { supabaseVectorQueryTool } from "../../src/tools/vector/supabase-vector-query"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const CRED_ID = "e2e-cred"
const credentials =
  SUPABASE_URL &&
  SUPABASE_KEY && {
    [CRED_ID]: {
      supabase_url: SUPABASE_URL,
      supabase_key: SUPABASE_KEY,
    },
  }

const skipE2E = !credentials

describe("Vector E2E", { skip: skipE2E }, () => {
  it("向量查询 - 需要已配置的 vector bucket 和 index", async () => {
    const result = await supabaseVectorQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          vector_bucket_name: "embeddings",
          index_name: "default",
          query_vector: JSON.stringify({
            float32: [0.1, 0.2, 0.3],
          }),
          top_k: 5,
        },
        credentials: credentials!,
      },
    } as any)

    expect(result.success).toBe(true)
  })
})
