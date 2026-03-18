/**
 * CRUD E2E 测试 - 需要真实 Supabase 实例
 * 设置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 或 SUPABASE_ANON_KEY 环境变量后运行:
 * bun run test:e2e
 */
import { afterEach, beforeAll, describe, expect, it } from "vitest"
import { createClient } from "@supabase/supabase-js"
import { supabaseInsertTool } from "../../src/tools/db/supabase-insert"
import { supabaseQueryTool } from "../../src/tools/db/supabase-query"
import { supabaseUpdateTool } from "../../src/tools/db/supabase-update"
import { supabaseDeleteTool } from "../../src/tools/db/supabase-delete"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY

const CRED_ID = "e2e-cred"
const TABLE = "e2e_test_crud"
let createdId: number | null = null

const credentials = SUPABASE_URL &&
  SUPABASE_KEY && {
    [CRED_ID]: {
      supabase_url: SUPABASE_URL,
      supabase_key: SUPABASE_KEY,
    },
  }

const skipE2E = !credentials

/**
 * 运行前请在 Supabase SQL Editor 中创建测试表:
 * create table if not exists public.e2e_test_crud (
 *   id serial primary key,
 *   name text,
 *   created_at timestamptz default now()
 * );
 */

async function cleanup() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !createdId) return
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  await supabase.from(TABLE).delete().eq("id", createdId)
}

beforeAll(async () => {
  if (skipE2E) return
})

afterEach(async () => {
  await cleanup()
})

describe("CRUD E2E", { skip: skipE2E }, () => {
  it("insert -> query -> update -> delete", async () => {
    const insertResult = await supabaseInsertTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: TABLE,
          rows: JSON.stringify({ name: "e2e-test" }),
        },
        credentials: credentials!,
      },
    } as any)

    expect(insertResult.success).toBe(true)
    const data = insertResult.data as { id: number }[] | { id: number }
    createdId = Array.isArray(data) ? data[0]?.id : data?.id
    expect(createdId).toBeDefined()

    const queryResult = await supabaseQueryTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: TABLE,
          filters: JSON.stringify({ id: createdId }),
        },
        credentials: credentials!,
      },
    } as any)

    expect(queryResult.success).toBe(true)
    const rows = queryResult.data as { id: number; name: string }[]
    expect(Array.isArray(rows) ? rows[0] : rows).toMatchObject({
      name: "e2e-test",
    })

    const updateResult = await supabaseUpdateTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: TABLE,
          values: JSON.stringify({ name: "e2e-updated" }),
          filters: JSON.stringify({ id: createdId }),
        },
        credentials: credentials!,
      },
    } as any)

    expect(updateResult.success).toBe(true)

    const deleteResult = await supabaseDeleteTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          table: TABLE,
          filters: JSON.stringify({ id: createdId }),
        },
        credentials: credentials!,
      },
    } as any)

    expect(deleteResult.success).toBe(true)
    createdId = null
  })
})
