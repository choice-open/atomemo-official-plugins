import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockSupabaseClient } from "../helpers/mock-supabase"
import { supabaseUpsertTool } from "../../src/tools/db/supabase-upsert"

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
    createMockSupabaseClient({ data: [{ id: 1 }] }),
  )
})

describe("supabaseUpsertTool", () => {
  it("invoke 成功 upsert", async () => {
    const result = await supabaseUpsertTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "users",
          rows: '{"id": 1, "name": "upserted"}',
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result).toMatchObject({ success: true, error: null })
  })

  it("支持 on_conflict 参数", async () => {
    const result = await supabaseUpsertTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: "users",
          rows: '[{"email":"a@b.com"}]',
          on_conflict: "email",
        },
        credentials: CREDENTIALS,
      },
    } as any)

    expect(result.success).toBe(true)
  })
})
