import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseVectorCreateBucketTool } from "../../src/tools/vector/supabase-vector-create-bucket"
import { supabaseVectorCreateIndexTool } from "../../src/tools/vector/supabase-vector-create-index"
import { supabaseVectorDeleteBucketTool } from "../../src/tools/vector/supabase-vector-delete-bucket"
import { supabaseVectorDeleteIndexTool } from "../../src/tools/vector/supabase-vector-delete-index"
import { supabaseVectorDeleteTool } from "../../src/tools/vector/supabase-vector-delete"
import { supabaseVectorGetBucketTool } from "../../src/tools/vector/supabase-vector-get-bucket"
import { supabaseVectorGetIndexTool } from "../../src/tools/vector/supabase-vector-get-index"
import { supabaseVectorGetTool } from "../../src/tools/vector/supabase-vector-get"
import { supabaseVectorListBucketsTool } from "../../src/tools/vector/supabase-vector-list-buckets"
import { supabaseVectorListIndexesTool } from "../../src/tools/vector/supabase-vector-list-indexes"
import { supabaseVectorListTool } from "../../src/tools/vector/supabase-vector-list"
import { supabaseVectorPutTool } from "../../src/tools/vector/supabase-vector-put"
import { supabaseVectorQueryTool } from "../../src/tools/vector/supabase-vector-query"

const CRED_ID = "cred"
const cred = {
  [CRED_ID]: {
    supabase_url: "https://xxx.supabase.co",
    supabase_key: "test-key",
  },
}

const mockIndexScope = {
  putVectors: vi.fn().mockResolvedValue({ error: null }),
  getVectors: vi.fn().mockResolvedValue({ data: { vectors: [] }, error: null }),
  listVectors: vi.fn().mockResolvedValue({ data: { vectors: [], nextToken: undefined }, error: null }),
  queryVectors: vi.fn().mockResolvedValue({ data: { matches: [] }, error: null }),
  deleteVectors: vi.fn().mockResolvedValue({ error: null }),
}

const mockBucketScope = {
  listIndexes: vi.fn().mockResolvedValue({ data: { indexes: [], nextToken: undefined }, error: null }),
  createIndex: vi.fn().mockResolvedValue({ error: null }),
  getIndex: vi.fn().mockResolvedValue({ data: { index: {} }, error: null }),
  deleteIndex: vi.fn().mockResolvedValue({ error: null }),
  index: vi.fn(() => mockIndexScope),
}

const mockVectors = {
  listBuckets: vi.fn().mockResolvedValue({ data: { vectorBuckets: [], nextToken: undefined }, error: null }),
  createBucket: vi.fn().mockResolvedValue({ error: null }),
  getBucket: vi.fn().mockResolvedValue({ data: { vectorBucket: {} }, error: null }),
  deleteBucket: vi.fn().mockResolvedValue({ error: null }),
  from: vi.fn(() => mockBucketScope),
}

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    storage: { vectors: mockVectors },
  })),
}))

const missingCredError = {
  success: false,
  error: "Missing Supabase credential (supabase_url or supabase_key).",
  data: null,
  code: null,
}

describe("Vector tools – credential and shape", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("supabase-vector-list-buckets", () => {
    it("has correct name and params", () => {
      expect(supabaseVectorListBucketsTool.name).toBe("supabase-vector-list-buckets")
      const names = supabaseVectorListBucketsTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("prefix")
      expect(names).toContain("max_results")
      expect(names).toContain("next_token")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorListBucketsTool.invoke({
        args: { parameters: {}, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
      expect(mockVectors.listBuckets).not.toHaveBeenCalled()
    })
    it("calls listBuckets and returns success when credential provided", async () => {
      const r = await supabaseVectorListBucketsTool.invoke({
        args: { parameters: { supabase_credential: CRED_ID }, credentials: cred },
      })
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockVectors.listBuckets).toHaveBeenCalled()
    })
  })

  describe("supabase-vector-create-bucket", () => {
    it("has correct name and params", () => {
      expect(supabaseVectorCreateBucketTool.name).toBe("supabase-vector-create-bucket")
      const names = supabaseVectorCreateBucketTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("vector_bucket_name")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorCreateBucketTool.invoke({
        args: { parameters: { vector_bucket_name: "b1" }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("returns error when vector_bucket_name empty", async () => {
      const r = await supabaseVectorCreateBucketTool.invoke({
        args: { parameters: { supabase_credential: CRED_ID, vector_bucket_name: "   " }, credentials: cred },
      })
      expect(r).toMatchObject({ success: false, error: "vector_bucket_name is required." })
    })
    it("calls createBucket and returns success", async () => {
      const r = await supabaseVectorCreateBucketTool.invoke({
        args: { parameters: { supabase_credential: CRED_ID, vector_bucket_name: "my-bucket" }, credentials: cred },
      })
      expect(r).toMatchObject({ success: true, data: { vectorBucketName: "my-bucket" } })
      expect(mockVectors.createBucket).toHaveBeenCalledWith("my-bucket")
    })
  })

  describe("supabase-vector-get-bucket", () => {
    it("has correct name and returns error when credential missing", async () => {
      expect(supabaseVectorGetBucketTool.name).toBe("supabase-vector-get-bucket")
      const r = await supabaseVectorGetBucketTool.invoke({
        args: { parameters: { vector_bucket_name: "b1" }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls getBucket when credential provided", async () => {
      const r = await supabaseVectorGetBucketTool.invoke({
        args: { parameters: { supabase_credential: CRED_ID, vector_bucket_name: "b1" }, credentials: cred },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockVectors.getBucket).toHaveBeenCalledWith("b1")
    })
  })

  describe("supabase-vector-delete-bucket", () => {
    it("has correct name and returns error when credential missing", async () => {
      expect(supabaseVectorDeleteBucketTool.name).toBe("supabase-vector-delete-bucket")
      const r = await supabaseVectorDeleteBucketTool.invoke({
        args: { parameters: { vector_bucket_name: "b1" }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls deleteBucket when credential provided", async () => {
      const r = await supabaseVectorDeleteBucketTool.invoke({
        args: { parameters: { supabase_credential: CRED_ID, vector_bucket_name: "b1" }, credentials: cred },
      })
      expect(r).toMatchObject({ success: true, data: null })
      expect(mockVectors.deleteBucket).toHaveBeenCalledWith("b1")
    })
  })

  describe("supabase-vector-list-indexes", () => {
    it("has correct name and returns error when credential missing", async () => {
      expect(supabaseVectorListIndexesTool.name).toBe("supabase-vector-list-indexes")
      const r = await supabaseVectorListIndexesTool.invoke({
        args: { parameters: { vector_bucket_name: "b1" }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls from().listIndexes when credential provided", async () => {
      const r = await supabaseVectorListIndexesTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, vector_bucket_name: "b1" },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockVectors.from).toHaveBeenCalledWith("b1")
      expect(mockBucketScope.listIndexes).toHaveBeenCalled()
    })
  })

  describe("supabase-vector-create-index", () => {
    it("has correct name and required params", () => {
      expect(supabaseVectorCreateIndexTool.name).toBe("supabase-vector-create-index")
      const names = supabaseVectorCreateIndexTool.parameters.map((p) => p.name)
      expect(names).toContain("vector_bucket_name")
      expect(names).toContain("index_name")
      expect(names).toContain("dimension")
      expect(names).toContain("distance_metric")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorCreateIndexTool.invoke({
        args: {
          parameters: { vector_bucket_name: "b1", index_name: "idx1", dimension: 128, distance_metric: "cosine" },
          credentials: {},
        },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls createIndex when credential and required params provided", async () => {
      const r = await supabaseVectorCreateIndexTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            vector_bucket_name: "b1",
            index_name: "idx1",
            dimension: 128,
            distance_metric: "cosine",
          },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true, data: { vectorBucketName: "b1", indexName: "idx1" } })
      expect(mockBucketScope.createIndex).toHaveBeenCalledWith(
        expect.objectContaining({ indexName: "idx1", dimension: 128, distanceMetric: "cosine" }),
      )
    })
  })

  describe("supabase-vector-get-index", () => {
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorGetIndexTool.invoke({
        args: { parameters: { vector_bucket_name: "b1", index_name: "idx1" }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls getIndex when credential provided", async () => {
      const r = await supabaseVectorGetIndexTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, vector_bucket_name: "b1", index_name: "idx1" },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockBucketScope.getIndex).toHaveBeenCalledWith("idx1")
    })
  })

  describe("supabase-vector-delete-index", () => {
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorDeleteIndexTool.invoke({
        args: { parameters: { vector_bucket_name: "b1", index_name: "idx1" }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls deleteIndex when credential provided", async () => {
      const r = await supabaseVectorDeleteIndexTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, vector_bucket_name: "b1", index_name: "idx1" },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockBucketScope.deleteIndex).toHaveBeenCalledWith("idx1")
    })
  })

  describe("supabase-vector-put", () => {
    it("has vectors param and returns error when credential missing", async () => {
      expect(supabaseVectorPutTool.name).toBe("supabase-vector-put")
      const r = await supabaseVectorPutTool.invoke({
        args: {
          parameters: { vector_bucket_name: "b1", index_name: "idx1", vectors: '[{"key":"k1","data":{"float32":[0.1]}}]' },
          credentials: {},
        },
      })
      expect(r).toEqual(missingCredError)
    })
    it("returns error when vectors not valid JSON array", async () => {
      const r = await supabaseVectorPutTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, vector_bucket_name: "b1", index_name: "idx1", vectors: "[]" },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: false, error: expect.stringContaining("non-empty") })
    })
    it("calls putVectors when credential and valid vectors provided", async () => {
      const r = await supabaseVectorPutTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            vector_bucket_name: "b1",
            index_name: "idx1",
            vectors: '[{"key":"k1","data":{"float32":[0.1,0.2]}}]',
          },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockVectors.from).toHaveBeenCalledWith("b1")
      expect(mockBucketScope.index).toHaveBeenCalledWith("idx1")
      expect(mockIndexScope.putVectors).toHaveBeenCalledWith(
        expect.objectContaining({
          vectors: expect.arrayContaining([
            expect.objectContaining({ key: "k1", data: { float32: [0.1, 0.2] } }),
          ]),
        }),
      )
    })
  })

  describe("supabase-vector-get", () => {
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorGetTool.invoke({
        args: { parameters: { vector_bucket_name: "b1", index_name: "idx1", keys: '["k1"]' }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls getVectors when credential and keys provided", async () => {
      const r = await supabaseVectorGetTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            vector_bucket_name: "b1",
            index_name: "idx1",
            keys: '["k1","k2"]',
          },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockIndexScope.getVectors).toHaveBeenCalledWith(
        expect.objectContaining({ keys: ["k1", "k2"] }),
      )
    })
  })

  describe("supabase-vector-list", () => {
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorListTool.invoke({
        args: { parameters: { vector_bucket_name: "b1", index_name: "idx1" }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls listVectors when credential provided", async () => {
      const r = await supabaseVectorListTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, vector_bucket_name: "b1", index_name: "idx1" },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockIndexScope.listVectors).toHaveBeenCalled()
    })
  })

  describe("supabase-vector-query", () => {
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorQueryTool.invoke({
        args: {
          parameters: { vector_bucket_name: "b1", index_name: "idx1", query_vector: '{"float32":[0.1]}' },
          credentials: {},
        },
      })
      expect(r).toEqual(missingCredError)
    })
    it("calls queryVectors when credential and query_vector provided", async () => {
      const r = await supabaseVectorQueryTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            vector_bucket_name: "b1",
            index_name: "idx1",
            query_vector: '{"float32":[0.1,0.2]}',
            top_k: 5,
          },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockIndexScope.queryVectors).toHaveBeenCalledWith(
        expect.objectContaining({
          queryVector: { float32: [0.1, 0.2] },
          topK: 5,
        }),
      )
    })
  })

  describe("supabase-vector-delete", () => {
    it("returns error when credential missing", async () => {
      const r = await supabaseVectorDeleteTool.invoke({
        args: { parameters: { vector_bucket_name: "b1", index_name: "idx1", keys: '["k1"]' }, credentials: {} },
      })
      expect(r).toEqual(missingCredError)
    })
    it("returns error when keys empty array", async () => {
      const r = await supabaseVectorDeleteTool.invoke({
        args: {
          parameters: { supabase_credential: CRED_ID, vector_bucket_name: "b1", index_name: "idx1", keys: "[]" },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: false, error: expect.stringContaining("non-empty") })
    })
    it("calls deleteVectors when credential and keys provided", async () => {
      const r = await supabaseVectorDeleteTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            vector_bucket_name: "b1",
            index_name: "idx1",
            keys: '["k1","k2"]',
          },
          credentials: cred,
        },
      })
      expect(r).toMatchObject({ success: true })
      expect(mockIndexScope.deleteVectors).toHaveBeenCalledWith({ keys: ["k1", "k2"] })
    })
  })
})
