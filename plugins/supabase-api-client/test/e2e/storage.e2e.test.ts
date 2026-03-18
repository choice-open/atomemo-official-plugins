/**
 * Storage E2E 测试 - 需要 Supabase Storage bucket
 * 设置 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY 环境变量
 * 确保存在名为 e2e-test 的 bucket
 */
import { afterEach, describe, expect, it } from "vitest"
import { supabaseStorageUploadTool } from "../../src/tools/storage/supabase-storage-upload"
import { supabaseStorageListFilesTool } from "../../src/tools/storage/supabase-storage-list-files"
import { supabaseStorageRemoveTool } from "../../src/tools/storage/supabase-storage-remove"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const CRED_ID = "e2e-cred"
const BUCKET = "e2e-test"
const TEST_PATH = "e2e/upload-test.txt"

const credentials =
  SUPABASE_URL &&
  SUPABASE_KEY && {
    [CRED_ID]: {
      supabase_url: SUPABASE_URL,
      supabase_key: SUPABASE_KEY,
    },
  }

const skipE2E = !credentials

afterEach(async () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) return
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  try {
    await supabase.storage.from(BUCKET).remove([TEST_PATH])
  } catch {
    // ignore
  }
})

describe("Storage E2E", { skip: skipE2E }, () => {
  it("upload -> list -> remove", async () => {
    const uploadResult = await supabaseStorageUploadTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          bucket: BUCKET,
          path: TEST_PATH,
          file_content: "e2e test content",
        },
        credentials: credentials!,
      },
      context: {},
    } as any)

    expect(uploadResult.success).toBe(true)

    const listResult = await supabaseStorageListFilesTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          bucket: BUCKET,
          path: "e2e",
        },
        credentials: credentials!,
      },
    } as any)

    expect(listResult.success).toBe(true)

    const removeResult = await supabaseStorageRemoveTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          bucket: BUCKET,
          paths: JSON.stringify([TEST_PATH]),
        },
        credentials: credentials!,
      },
    } as any)

    expect(removeResult.success).toBe(true)
  })
})
