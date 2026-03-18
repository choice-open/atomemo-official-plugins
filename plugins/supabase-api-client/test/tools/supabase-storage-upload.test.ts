import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockSupabaseClient } from "../helpers/mock-supabase"
import { supabaseStorageUploadTool } from "../../src/tools/storage/supabase-storage-upload"

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
    createMockSupabaseClient({ data: { path: "folder/file.txt" } }),
  )
})

describe("supabaseStorageUploadTool", () => {
  it("invoke 使用 file_content 成功上传", async () => {
    const result = await supabaseStorageUploadTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          bucket: "my-bucket",
          path: "folder/file.txt",
          file_content: "hello world",
        },
        credentials: CREDENTIALS,
      },
      context: {},
    } as any)

    expect(result).toMatchObject({ success: true, error: null })
  })

  it("bucket 或 path 缺失时抛出错误", async () => {
    await expect(
      supabaseStorageUploadTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            bucket: "",
            path: "file.txt",
            file_content: "x",
          },
          credentials: CREDENTIALS,
        },
        context: {},
      } as any),
    ).rejects.toThrow("bucket")
  })

  it("同时提供 file 和 file_content 时抛出错误", async () => {
    await expect(
      supabaseStorageUploadTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            bucket: "b",
            path: "folder/file.txt",
            file_content: "x",
            file: "file-ref-123",
          },
          credentials: CREDENTIALS,
        },
        context: {},
      } as any),
    ).rejects.toThrow("either")
  })

  it("file_content 且 path 不含文件名时抛出错误", async () => {
    await expect(
      supabaseStorageUploadTool.invoke({
        args: {
          parameters: {
            supabase_credential: CRED_ID,
            bucket: "b",
            path: "folder/",
            file_content: "x",
          },
          credentials: CREDENTIALS,
        },
        context: {},
      } as any),
    ).rejects.toThrow("filename")
  })
})
