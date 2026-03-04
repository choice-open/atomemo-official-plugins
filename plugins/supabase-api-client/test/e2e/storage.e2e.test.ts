/**
 * E2E：对真实 Supabase Storage 执行 bucket / file 的完整读写删流程。
 * - SUPABASE_URL + SUPABASE_KEY：service_role key（需有 storage 权限）。
 *
 * 建议提前在项目中启用 Storage 功能；测试会自动创建一个专用 bucket（public）。
 */
import "dotenv/config"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createSupabaseClient } from "../../src/lib/get-supabase-client"
import { supabaseStorageCreateSignedUrlTool } from "../../src/tools/storage/supabase-storage-create-signed-url"
import { supabaseStorageDownloadTool } from "../../src/tools/storage/supabase-storage-download"
import { supabaseStorageGetPublicUrlTool } from "../../src/tools/storage/supabase-storage-get-public-url"
import { supabaseStorageListBucketsTool } from "../../src/tools/storage/supabase-storage-list-buckets"
import { supabaseStorageListFilesTool } from "../../src/tools/storage/supabase-storage-list-files"
import { supabaseStorageRemoveTool } from "../../src/tools/storage/supabase-storage-remove"
import { supabaseStorageUploadTool } from "../../src/tools/storage/supabase-storage-upload"

const BUCKET = "e2e-storage-bucket"
const CRED_ID = "e2e_cred"
const FILE_PATH = "e2e-folder/hello.txt"
const FILE_CONTENT = "Hello from storage e2e"

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
  return {
    supabase_credential: CRED_ID,
    ...extra,
  }
}

describe("e2e: Storage – bucket + files", { skip: !hasEnv }, () => {
  beforeAll(async () => {
    if (!hasEnv) return
    const supabase = createSupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    )

    // 确保 bucket 存在且为 public
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some((b) => b.name === BUCKET)
    if (!exists) {
      await supabase.storage.createBucket(BUCKET, {
        public: true,
      })
    } else {
      // 如果已存在，尽量设置为 public（忽略错误）
      try {
        await supabase.storage.updateBucket(BUCKET, { public: true })
      } catch {
        // ignore
      }
    }

    // 清理残留测试文件
    const { data: files } = await supabase.storage.from(BUCKET).list("e2e-folder", {
      limit: 100,
      offset: 0,
    })
    if (files && files.length > 0) {
      const paths = files.map((f) => `e2e-folder/${f.name}`)
      await supabase.storage.from(BUCKET).remove(paths)
    }
  })

  afterAll(async () => {
    if (!hasEnv) return
    const supabase = createSupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    )
    // 只清理我们创建的测试文件，保留 bucket 方便重复运行
    const { data: files } = await supabase.storage.from(BUCKET).list("e2e-folder", {
      limit: 100,
      offset: 0,
    })
    if (files && files.length > 0) {
      const paths = files.map((f) => `e2e-folder/${f.name}`)
      await supabase.storage.from(BUCKET).remove(paths)
    }
  })

  it("列出 buckets（包含测试 bucket）", async () => {
    const r = await supabaseStorageListBucketsTool.invoke({
      args: {
        parameters: params({ limit: 100, offset: 0 }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { name: string }[] }).data
    expect(Array.isArray(data)).toBe(true)
    expect(data!.some((b) => b.name === BUCKET)).toBe(true)
  })

  it("上传文件到 Storage", async () => {
    const r = await supabaseStorageUploadTool.invoke({
      args: {
        parameters: params({
          bucket: BUCKET,
          path: FILE_PATH,
          file_content: FILE_CONTENT,
          content_type: "text/plain",
          upsert: true,
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
  })

  it("列出文件（包含刚上传的文件）", async () => {
    const r = await supabaseStorageListFilesTool.invoke({
      args: {
        parameters: params({
          bucket: BUCKET,
          path: "e2e-folder",
          limit: 100,
          offset: 0,
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { name: string }[] }).data
    expect(Array.isArray(data)).toBe(true)
    expect(
      data!.some((f) => f.name === FILE_PATH.replace("e2e-folder/", "")),
    ).toBe(true)
  })

  it("获取公共 URL（依赖 public bucket）", async () => {
    const r = await supabaseStorageGetPublicUrlTool.invoke({
      args: {
        parameters: params({
          bucket: BUCKET,
          path: FILE_PATH,
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { publicUrl?: string } }).data
    expect(typeof data?.publicUrl).toBe("string")
    expect(data?.publicUrl && data.publicUrl.length).toBeGreaterThan(0)
  })

  it("创建签名 URL", async () => {
    const r = await supabaseStorageCreateSignedUrlTool.invoke({
      args: {
        parameters: params({
          bucket: BUCKET,
          path: FILE_PATH,
          expires_in: 600,
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { signedUrl?: string } }).data
    expect(typeof data?.signedUrl).toBe("string")
    expect(data?.signedUrl && data.signedUrl.length).toBeGreaterThan(0)
  })

  it("下载文件并返回 base64 内容", async () => {
    const r = await supabaseStorageDownloadTool.invoke({
      args: {
        parameters: params({
          bucket: BUCKET,
          path: FILE_PATH,
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { content_base64?: string; content_type?: string; size?: number } }).data
    expect(typeof data?.content_base64).toBe("string")
    expect(data?.content_base64 && data.content_base64.length).toBeGreaterThan(0)
    expect(typeof data?.content_type).toBe("string")
    if (data?.content_type) {
      expect(data.content_type.startsWith("text/plain")).toBe(true)
    }
    expect(typeof data?.size).toBe("number")
    expect(data!.size! > 0).toBe(true)
  })

  it("删除文件", async () => {
    const r = await supabaseStorageRemoveTool.invoke({
      args: {
        parameters: params({
          bucket: BUCKET,
          paths: JSON.stringify([FILE_PATH]),
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
  })

  it("删除后 list 不再包含该文件", async () => {
    const r = await supabaseStorageListFilesTool.invoke({
      args: {
        parameters: params({
          bucket: BUCKET,
          path: "e2e-folder",
          limit: 100,
          offset: 0,
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { name: string }[] }).data
    if (!Array.isArray(data)) return
    expect(
      data.some((f) => f.name === FILE_PATH.replace("e2e-folder/", "")),
    ).toBe(false)
  })
})

