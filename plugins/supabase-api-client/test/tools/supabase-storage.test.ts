import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseStorageCreateSignedUrlTool } from "../../src/tools/supabase-storage-create-signed-url"
import { supabaseStorageDownloadTool } from "../../src/tools/supabase-storage-download"
import { supabaseStorageGetPublicUrlTool } from "../../src/tools/supabase-storage-get-public-url"
import { supabaseStorageListBucketsTool } from "../../src/tools/supabase-storage-list-buckets"
import { supabaseStorageListFilesTool } from "../../src/tools/supabase-storage-list-files"
import { supabaseStorageRemoveTool } from "../../src/tools/supabase-storage-remove"
import { supabaseStorageUploadTool } from "../../src/tools/supabase-storage-upload"

const CRED_KEY = "supabase_credential"
const cred = {
  [CRED_KEY]: {
    supabase_url: "https://xxx.supabase.co",
    supabase_key: "test-key",
  },
}

const missingCredError = {
  success: false,
  error: "Missing Supabase credential (supabase_url or supabase_key).",
  data: null,
  code: null,
}

function args(parameters: Record<string, unknown> = {}, credentials: Record<string, unknown> = cred) {
  const params = { ...parameters }
  if (credentials?.[CRED_KEY] != null && params.supabase_credential === undefined) {
    params.supabase_credential = CRED_KEY
  }
  return { args: { parameters: params, credentials } }
}

const mockListBuckets = vi.fn()
const mockFrom = vi.fn()
const mockList = vi.fn()
const mockUpload = vi.fn()
const mockDownload = vi.fn()
const mockRemove = vi.fn()
const mockGetPublicUrl = vi.fn()
const mockCreateSignedUrl = vi.fn()

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    storage: {
      listBuckets: mockListBuckets,
      from: mockFrom.mockImplementation(() => ({
        list: mockList,
        upload: mockUpload,
        download: mockDownload,
        remove: mockRemove,
        getPublicUrl: mockGetPublicUrl,
        createSignedUrl: mockCreateSignedUrl,
      })),
    },
  })),
}))

describe("Storage tools – credential, validation, and API calls", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockListBuckets.mockResolvedValue({ data: [], error: null })
    mockList.mockResolvedValue({ data: [], error: null })
    mockUpload.mockResolvedValue({ data: { path: "folder/file.txt" }, error: null })

    const blobLike = {
      arrayBuffer: vi.fn().mockResolvedValue(new TextEncoder().encode("hello world")),
      type: "text/plain",
      size: 11,
    } as unknown as Blob
    mockDownload.mockResolvedValue({ data: blobLike, error: null })

    mockRemove.mockResolvedValue({ data: [], error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: "https://cdn.example.com/file.txt" } })
    mockCreateSignedUrl.mockResolvedValue({
      data: { signedUrl: "https://cdn.example.com/file.txt?token=xxx" },
      error: null,
    })
  })

  describe("supabase-storage-list-buckets", () => {
    it("has correct name and params", () => {
      expect(supabaseStorageListBucketsTool.name).toBe("supabase-storage-list-buckets")
      const names = supabaseStorageListBucketsTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("limit")
      expect(names).toContain("offset")
    })

    it("returns error when credential missing", async () => {
      const r = await supabaseStorageListBucketsTool.invoke(args({}, {}))
      expect(r).toEqual(missingCredError)
      expect(mockListBuckets).not.toHaveBeenCalled()
    })

    it("calls listBuckets and returns success", async () => {
      const r = await supabaseStorageListBucketsTool.invoke(args({ limit: 10, offset: 5 }))
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockListBuckets).toHaveBeenCalledWith({ limit: 10, offset: 5 })
    })
  })

  describe("supabase-storage-list-files", () => {
    it("has correct name and params", () => {
      expect(supabaseStorageListFilesTool.name).toBe("supabase-storage-list-files")
      const names = supabaseStorageListFilesTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("bucket")
      expect(names).toContain("path")
      expect(names).toContain("limit")
      expect(names).toContain("offset")
    })

    it("returns error when credential missing", async () => {
      const r = await supabaseStorageListFilesTool.invoke(args({ bucket: "b1" }, {}))
      expect(r).toEqual(missingCredError)
      expect(mockList).not.toHaveBeenCalled()
    })

    it("returns error when bucket empty", async () => {
      const r = await supabaseStorageListFilesTool.invoke(args({ bucket: "   " }))
      expect(r).toMatchObject({ success: false, error: "bucket is required." })
      expect(mockFrom).not.toHaveBeenCalled()
    })

    it("calls from(bucket).list with defaults when params provided", async () => {
      const r = await supabaseStorageListFilesTool.invoke(
        args({ bucket: "b1", path: "folder", limit: 20, offset: 2 }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockFrom).toHaveBeenCalledWith("b1")
      expect(mockList).toHaveBeenCalledWith("folder", {
        limit: 20,
        offset: 2,
        sortBy: { column: "name", order: "asc" },
      })
    })
  })

  describe("supabase-storage-upload", () => {
    it("has correct name and params", () => {
      expect(supabaseStorageUploadTool.name).toBe("supabase-storage-upload")
      const names = supabaseStorageUploadTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("bucket")
      expect(names).toContain("path")
      expect(names).toContain("file_content")
      expect(names).toContain("content_type")
      expect(names).toContain("upsert")
    })

    it("returns error when credential missing", async () => {
      const r = await supabaseStorageUploadTool.invoke(
        args({ bucket: "b1", path: "a.txt", file_content: "x" }, {}),
      )
      expect(r).toEqual(missingCredError)
      expect(mockUpload).not.toHaveBeenCalled()
    })

    it("returns error when bucket or path empty", async () => {
      const r1 = await supabaseStorageUploadTool.invoke(
        args({ bucket: "   ", path: "a.txt", file_content: "x" }),
      )
      expect(r1).toMatchObject({ success: false, error: "bucket and path are required." })

      const r2 = await supabaseStorageUploadTool.invoke(
        args({ bucket: "b1", path: "   ", file_content: "x" }),
      )
      expect(r2).toMatchObject({ success: false, error: "bucket and path are required." })
      expect(mockUpload).not.toHaveBeenCalled()
    })

    it("returns error when file_content empty", async () => {
      const r = await supabaseStorageUploadTool.invoke(
        args({ bucket: "b1", path: "a.txt", file_content: "" }),
      )
      expect(r).toMatchObject({
        success: false,
        error: "file_content is required (base64 string or plain text).",
      })
      expect(mockUpload).not.toHaveBeenCalled()
    })

    it("calls upload with decoded body and options", async () => {
      const r = await supabaseStorageUploadTool.invoke(
        args({
          bucket: "b1",
          path: "folder/a.txt",
          file_content: "hello world",
          content_type: "text/plain",
          upsert: true,
        }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockFrom).toHaveBeenCalledWith("b1")
      expect(mockUpload).toHaveBeenCalledWith(
        "folder/a.txt",
        "hello world",
        expect.objectContaining({ contentType: "text/plain", upsert: true }),
      )
    })
  })

  describe("supabase-storage-download", () => {
    it("has correct name and params", () => {
      expect(supabaseStorageDownloadTool.name).toBe("supabase-storage-download")
      const names = supabaseStorageDownloadTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("bucket")
      expect(names).toContain("path")
    })

    it("returns error when credential missing", async () => {
      const r = await supabaseStorageDownloadTool.invoke(
        args({ bucket: "b1", path: "a.txt" }, {}),
      )
      expect(r).toEqual(missingCredError)
      expect(mockDownload).not.toHaveBeenCalled()
    })

    it("returns error when bucket or path empty", async () => {
      const r1 = await supabaseStorageDownloadTool.invoke(
        args({ bucket: "   ", path: "a.txt" }),
      )
      expect(r1).toMatchObject({ success: false, error: "bucket and path are required." })

      const r2 = await supabaseStorageDownloadTool.invoke(
        args({ bucket: "b1", path: "   " }),
      )
      expect(r2).toMatchObject({ success: false, error: "bucket and path are required." })
      expect(mockDownload).not.toHaveBeenCalled()
    })

    it("calls download and returns base64 data", async () => {
      const r = await supabaseStorageDownloadTool.invoke(
        args({ bucket: "b1", path: "folder/a.txt" }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockFrom).toHaveBeenCalledWith("b1")
      expect(mockDownload).toHaveBeenCalledWith("folder/a.txt")
      const data = (r as { data?: { content_base64?: string; content_type?: string; size?: number } }).data
      expect(typeof data?.content_base64).toBe("string")
      expect(data?.content_base64 && data.content_base64.length).toBeGreaterThan(0)
      expect(data?.content_type).toBe("text/plain")
      expect(data?.size).toBe(11)
    })
  })

  describe("supabase-storage-remove", () => {
    it("has correct name and params", () => {
      expect(supabaseStorageRemoveTool.name).toBe("supabase-storage-remove")
      const names = supabaseStorageRemoveTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("bucket")
      expect(names).toContain("paths")
    })

    it("returns error when credential missing", async () => {
      const r = await supabaseStorageRemoveTool.invoke(
        args({ bucket: "b1", paths: '["a.txt"]' }, {}),
      )
      expect(r).toEqual(missingCredError)
      expect(mockRemove).not.toHaveBeenCalled()
    })

    it("returns error when bucket empty", async () => {
      const r = await supabaseStorageRemoveTool.invoke(
        args({ bucket: "   ", paths: '["a.txt"]' }),
      )
      expect(r).toMatchObject({ success: false, error: "bucket is required." })
      expect(mockRemove).not.toHaveBeenCalled()
    })

    it("returns error when paths empty array", async () => {
      const r = await supabaseStorageRemoveTool.invoke(
        args({ bucket: "b1", paths: "[]" }),
      )
      expect(r).toMatchObject({
        success: false,
        error:
          'paths must be a non-empty JSON array of file paths (e.g. ["folder/file.png"]).',
      })
      expect(mockRemove).not.toHaveBeenCalled()
    })

    it("calls remove with parsed and trimmed paths", async () => {
      const r = await supabaseStorageRemoveTool.invoke(
        args({ bucket: "b1", paths: '[" folder/a.txt ", "b.txt"]' }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockFrom).toHaveBeenCalledWith("b1")
      expect(mockRemove).toHaveBeenCalledWith(["folder/a.txt", "b.txt"])
    })
  })

  describe("supabase-storage-get-public-url", () => {
    it("has correct name and params", () => {
      expect(supabaseStorageGetPublicUrlTool.name).toBe("supabase-storage-get-public-url")
      const names = supabaseStorageGetPublicUrlTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("bucket")
      expect(names).toContain("path")
    })

    it("returns error when credential missing", async () => {
      const r = await supabaseStorageGetPublicUrlTool.invoke(
        args({ bucket: "b1", path: "a.txt" }, {}),
      )
      expect(r).toEqual(missingCredError)
      expect(mockGetPublicUrl).not.toHaveBeenCalled()
    })

    it("returns error when bucket or path empty", async () => {
      const r1 = await supabaseStorageGetPublicUrlTool.invoke(
        args({ bucket: "   ", path: "a.txt" }),
      )
      expect(r1).toMatchObject({ success: false, error: "bucket and path are required." })

      const r2 = await supabaseStorageGetPublicUrlTool.invoke(
        args({ bucket: "b1", path: "   " }),
      )
      expect(r2).toMatchObject({ success: false, error: "bucket and path are required." })
      expect(mockGetPublicUrl).not.toHaveBeenCalled()
    })

    it("calls getPublicUrl and returns data", async () => {
      const r = await supabaseStorageGetPublicUrlTool.invoke(
        args({ bucket: "b1", path: "folder/a.txt" }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockFrom).toHaveBeenCalledWith("b1")
      expect(mockGetPublicUrl).toHaveBeenCalledWith("folder/a.txt")
      const data = (r as { data?: { publicUrl?: string } }).data
      expect(data?.publicUrl).toBe("https://cdn.example.com/file.txt")
    })
  })

  describe("supabase-storage-create-signed-url", () => {
    it("has correct name and params", () => {
      expect(supabaseStorageCreateSignedUrlTool.name).toBe("supabase-storage-create-signed-url")
      const names = supabaseStorageCreateSignedUrlTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("bucket")
      expect(names).toContain("path")
      expect(names).toContain("expires_in")
    })

    it("returns error when credential missing", async () => {
      const r = await supabaseStorageCreateSignedUrlTool.invoke(
        args({ bucket: "b1", path: "a.txt" }, {}),
      )
      expect(r).toEqual(missingCredError)
      expect(mockCreateSignedUrl).not.toHaveBeenCalled()
    })

    it("returns error when bucket or path empty", async () => {
      const r1 = await supabaseStorageCreateSignedUrlTool.invoke(
        args({ bucket: "   ", path: "a.txt" }),
      )
      expect(r1).toMatchObject({ success: false, error: "bucket and path are required." })

      const r2 = await supabaseStorageCreateSignedUrlTool.invoke(
        args({ bucket: "b1", path: "   " }),
      )
      expect(r2).toMatchObject({ success: false, error: "bucket and path are required." })
      expect(mockCreateSignedUrl).not.toHaveBeenCalled()
    })

    it("calls createSignedUrl with defaults when expires_in not provided", async () => {
      const r = await supabaseStorageCreateSignedUrlTool.invoke(
        args({ bucket: "b1", path: "folder/a.txt" }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockFrom).toHaveBeenCalledWith("b1")
      expect(mockCreateSignedUrl).toHaveBeenCalledWith("folder/a.txt", 3600)
      const data = (r as { data?: { signedUrl?: string } }).data
      expect(data?.signedUrl).toBe("https://cdn.example.com/file.txt?token=xxx")
    })

    it("passes custom expires_in when provided", async () => {
      await supabaseStorageCreateSignedUrlTool.invoke(
        args({ bucket: "b1", path: "folder/a.txt", expires_in: 120 }),
      )
      expect(mockCreateSignedUrl).toHaveBeenCalledWith("folder/a.txt", 120)
    })
  })
})

