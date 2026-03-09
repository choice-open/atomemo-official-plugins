/**
 * E2E：对真实 Supabase 执行 Vector 桶、索引、向量数据的全生命周期测试。
 * - SUPABASE_URL + SUPABASE_KEY：service_role key（需有 storage 权限）。
 *
 * 依赖 Supabase Storage Vectors API（需要项目启用 Vectors 功能）。
 */
import "dotenv/config"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { supabaseVectorCreateBucketTool } from "../../src/tools/vector/supabase-vector-create-bucket"
import { supabaseVectorCreateIndexTool } from "../../src/tools/vector/supabase-vector-create-index"
import { supabaseVectorDeleteTool } from "../../src/tools/vector/supabase-vector-delete"
import { supabaseVectorDeleteBucketTool } from "../../src/tools/vector/supabase-vector-delete-bucket"
import { supabaseVectorDeleteIndexTool } from "../../src/tools/vector/supabase-vector-delete-index"
import { supabaseVectorGetTool } from "../../src/tools/vector/supabase-vector-get"
import { supabaseVectorGetBucketTool } from "../../src/tools/vector/supabase-vector-get-bucket"
import { supabaseVectorGetIndexTool } from "../../src/tools/vector/supabase-vector-get-index"
import { supabaseVectorListTool } from "../../src/tools/vector/supabase-vector-list"
import { supabaseVectorListBucketsTool } from "../../src/tools/vector/supabase-vector-list-buckets"
import { supabaseVectorListIndexesTool } from "../../src/tools/vector/supabase-vector-list-indexes"
import { supabaseVectorPutTool } from "../../src/tools/vector/supabase-vector-put"
import { supabaseVectorQueryTool } from "../../src/tools/vector/supabase-vector-query"

const BUCKET_NAME = "e2e-vec-bucket"
const INDEX_NAME = "e2e-vec-index"
const CRED_ID = "e2e_cred"
const DIMENSION = 4

const hasEnv =
  typeof process.env.SUPABASE_URL === "string" &&
  process.env.SUPABASE_URL.length > 0 &&
  typeof process.env.SUPABASE_KEY === "string" &&
  process.env.SUPABASE_KEY.length > 0

function credentials() {
  return {
    [CRED_ID]: {
      supabase_url: process.env.SUPABASE_URL!,
      supabase_key: process.env.SUPABASE_KEY!,
    },
  }
}

function params(extra: Record<string, unknown> = {}) {
  return { supabase_credential: CRED_ID, ...extra }
}

function bucketParams(extra: Record<string, unknown> = {}) {
  return params({ vector_bucket_name: BUCKET_NAME, ...extra })
}

function indexParams(extra: Record<string, unknown> = {}) {
  return bucketParams({ index_name: INDEX_NAME, ...extra })
}

describe("e2e: Vector 桶 + 索引 + 向量数据", { skip: !hasEnv }, () => {
  // ── beforeAll：清理残留测试资源 ──────────────────────────────────
  beforeAll(async () => {
    if (!hasEnv) return
    // 尝试删除残留索引和桶（忽略错误）
    try {
      await supabaseVectorDeleteIndexTool.invoke({
        args: { parameters: indexParams(), credentials: credentials() },
      })
    } catch {}
    try {
      await supabaseVectorDeleteBucketTool.invoke({
        args: { parameters: bucketParams(), credentials: credentials() },
      })
    } catch {}
  })

  afterAll(async () => {
    if (!hasEnv) return
    try {
      await supabaseVectorDeleteIndexTool.invoke({
        args: { parameters: indexParams(), credentials: credentials() },
      })
    } catch {}
    try {
      await supabaseVectorDeleteBucketTool.invoke({
        args: { parameters: bucketParams(), credentials: credentials() },
      })
    } catch {}
  })

  // ── Bucket 生命周期 ─────────────────────────────────────────────
  it("创建 Vector 桶", async () => {
    const r = await supabaseVectorCreateBucketTool.invoke({
      args: { parameters: bucketParams(), credentials: credentials() },
    })
    expect(r.success).toBe(true)
  })

  it("列出 Vector 桶（包含新建的桶）", async () => {
    const r = await supabaseVectorListBucketsTool.invoke({
      args: { parameters: params(), credentials: credentials() },
    })
    expect(r.success).toBe(true)
    const data = (
      r as { data?: { vectorBuckets?: { vectorBucketName?: string }[] } }
    ).data
    expect(Array.isArray(data?.vectorBuckets)).toBe(true)
    expect(
      data!.vectorBuckets!.some((b) => b.vectorBucketName === BUCKET_NAME),
    ).toBe(true)
  })

  it("获取 Vector 桶信息", async () => {
    const r = await supabaseVectorGetBucketTool.invoke({
      args: { parameters: bucketParams(), credentials: credentials() },
    })
    expect(r.success).toBe(true)
    const data = (
      r as { data?: { vectorBucket?: { vectorBucketName?: string } } }
    ).data
    expect(data?.vectorBucket?.vectorBucketName).toBe(BUCKET_NAME)
  })

  // ── Index 生命周期 ──────────────────────────────────────────────
  it("在桶中创建索引", async () => {
    const r = await supabaseVectorCreateIndexTool.invoke({
      args: {
        parameters: indexParams({
          data_type: "float32",
          dimension: DIMENSION,
          distance_metric: "cosine",
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
  })

  it("列出桶内索引（包含新建的索引）", async () => {
    const r = await supabaseVectorListIndexesTool.invoke({
      args: { parameters: bucketParams(), credentials: credentials() },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { indexes?: { indexName?: string }[] } }).data
    expect(Array.isArray(data?.indexes)).toBe(true)
    expect(data!.indexes!.some((i) => i.indexName === INDEX_NAME)).toBe(true)
  })

  it("获取索引详情", async () => {
    const r = await supabaseVectorGetIndexTool.invoke({
      args: { parameters: indexParams(), credentials: credentials() },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { index?: { indexName?: string } } }).data
    expect(data?.index?.indexName).toBe(INDEX_NAME)
  })

  // ── 向量数据 CRUD ───────────────────────────────────────────────
  it("写入向量（putVectors）", async () => {
    const vectors = JSON.stringify([
      { key: "vec-1", data: { float32: [0.1, 0.2, 0.3, 0.4] } },
      { key: "vec-2", data: { float32: [0.5, 0.6, 0.7, 0.8] } },
      {
        key: "vec-3",
        data: { float32: [0.9, 0.1, 0.2, 0.3] },
        metadata: { tag: "test" },
      },
    ])
    const r = await supabaseVectorPutTool.invoke({
      args: {
        parameters: indexParams({ vectors }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
  })

  it("按 key 获取向量（getVectors）", async () => {
    const r = await supabaseVectorGetTool.invoke({
      args: {
        parameters: indexParams({
          keys: JSON.stringify(["vec-1", "vec-2"]),
          return_data: true,
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { vectors?: { key?: string }[] } }).data
    expect(Array.isArray(data?.vectors)).toBe(true)
    expect(data!.vectors!.length).toBeGreaterThanOrEqual(1)
  })

  it("列出向量（listVectors）", async () => {
    const r = await supabaseVectorListTool.invoke({
      args: {
        parameters: indexParams({ max_results: 10 }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { vectors?: unknown[] } }).data
    expect(Array.isArray(data?.vectors)).toBe(true)
    expect(data!.vectors!.length).toBeGreaterThanOrEqual(1)
  })

  it("相似性查询（queryVectors）", { timeout: 15000 }, async () => {
    const queryVector = JSON.stringify({ float32: [0.1, 0.2, 0.3, 0.4] })
    const r = await supabaseVectorQueryTool.invoke({
      args: {
        parameters: indexParams({
          query_vector: queryVector,
          top_k: 3,
          return_distance: true,
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { vectors?: unknown[] } }).data
    expect(Array.isArray(data?.vectors)).toBe(true)
    expect(data!.vectors!.length).toBeGreaterThanOrEqual(1)
  })

  it("删除向量（deleteVectors）", async () => {
    const r = await supabaseVectorDeleteTool.invoke({
      args: {
        parameters: indexParams({ keys: JSON.stringify(["vec-3"]) }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
  })

  it("删除后 listVectors 数量减少", async () => {
    const r = await supabaseVectorListTool.invoke({
      args: {
        parameters: indexParams({ max_results: 10 }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { vectors?: unknown[] } }).data
    // vec-1, vec-2 仍存在；vec-3 已删除
    expect(Array.isArray(data?.vectors)).toBe(true)
    expect(data!.vectors!.length).toBeLessThan(3)
  })

  // ── 清理：先删索引，再删桶 ────────────────────────────────────────
  it("删除索引", async () => {
    const r = await supabaseVectorDeleteIndexTool.invoke({
      args: { parameters: indexParams(), credentials: credentials() },
    })
    expect(r.success).toBe(true)
  })

  it("删除 Vector 桶", async () => {
    const r = await supabaseVectorDeleteBucketTool.invoke({
      args: { parameters: bucketParams(), credentials: credentials() },
    })
    expect(r.success).toBe(true)
  })
})
