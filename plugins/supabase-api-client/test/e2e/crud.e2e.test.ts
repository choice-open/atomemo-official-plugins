/**
 * E2E：对真实 Supabase 执行查、增、改、删，覆盖 filters（对象/数组）与 modifiers。
 * - SUPABASE_URL + SUPABASE_KEY：service_role key 的 CRUD 测试。
 * - SUPABASE_URL + SUPABASE_ANON_KEY：Publishable key（anon）的 e2e 测试，需 RLS 允许。
 *
 * 建表 SQL（在 Supabase SQL Editor 中执行一次）：
 *   create table public.e2e_test (
 *     id uuid primary key default gen_random_uuid(),
 *     name text not null,
 *     score int default 0,
 *     created_at timestamptz default now()
 *   );
 *   alter table public.e2e_test enable row level security;
 *   create policy "Allow all for e2e" on public.e2e_test for all using (true) with check (true);
 *
 * RPC e2e 用到的函数（在 SQL Editor 中执行一次）：
 *   create or replace function public.get_e2e_test_count() returns bigint as $$
 *     select count(*)::bigint from public.e2e_test where name like 'e2e-%';
 *   $$ language sql security definer;
 *   create or replace function public.e2e_echo(val text) returns text as $$
 *     select val;
 *   $$ language sql;
 */
import "dotenv/config"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createSupabaseClient } from "../../src/lib/get-supabase-client"
import { supabaseDeleteTool } from "../../src/tools/db/supabase-delete"
import { supabaseInsertTool } from "../../src/tools/db/supabase-insert"
import { supabaseQueryTool } from "../../src/tools/db/supabase-query"
import { supabaseRpcTool } from "../../src/tools/db/supabase-rpc"
import { supabaseUpdateTool } from "../../src/tools/db/supabase-update"

const TABLE = "e2e_test"
const CRED_ID = "e2e_cred"

const hasEnv =
  typeof process.env.SUPABASE_URL === "string" &&
  process.env.SUPABASE_URL.length > 0 &&
  typeof process.env.SUPABASE_KEY === "string" &&
  process.env.SUPABASE_KEY.length > 0

const hasAnonEnv =
  typeof process.env.SUPABASE_URL === "string" &&
  process.env.SUPABASE_URL.length > 0 &&
  typeof process.env.SUPABASE_ANON_KEY === "string" &&
  process.env.SUPABASE_ANON_KEY.length > 0

function credentials() {
  return {
    [CRED_ID]: {
      supabase_url: process.env.SUPABASE_URL!,
      supabase_key: process.env.SUPABASE_KEY!,
    },
  }
}

function credentialsAnon() {
  return {
    [CRED_ID]: {
      supabase_url: process.env.SUPABASE_URL!,
      supabase_key: process.env.SUPABASE_ANON_KEY!,
    },
  }
}

function params(extra: Record<string, unknown> = {}) {
  return {
    supabase_credential: CRED_ID,
    table: TABLE,
    schema: "public",
    ...extra,
  }
}

describe("e2e: CRUD + filters + modifiers", { skip: !hasEnv }, () => {
  beforeAll(async () => {
    if (!hasEnv) return
    const supabase = createSupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    )
    const { error } = await supabase.from(TABLE).delete().like("name", "e2e-%")
    if (error) {
      console.warn("e2e beforeAll cleanup:", error.message)
    }
  })

  afterAll(async () => {
    if (!hasEnv) return
    const supabase = createSupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    )
    const { error } = await supabase.from(TABLE).delete().like("name", "e2e-%")
    if (error) console.warn("e2e afterAll cleanup:", error.message)
  })

  it("增：insert 两条", async () => {
    const r = await supabaseInsertTool.invoke({
      args: {
        parameters: params({
          rows: JSON.stringify([
            { name: "e2e-a", score: 10 },
            { name: "e2e-b", score: 20 },
          ]),
          returning: "representation",
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    expect((r as { data?: unknown[] }).data).toBeDefined()
    const data = (r as { data?: unknown[] }).data
    expect(Array.isArray(data) && data.length).toBe(2)
  })

  it("查：filters 对象等值", async () => {
    const r = await supabaseQueryTool.invoke({
      args: {
        parameters: params({ filters: JSON.stringify({ name: "e2e-a" }) }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { name: string; score: number }[] }).data
    expect(Array.isArray(data) && data.length).toBe(1)
    expect(data![0].name).toBe("e2e-a")
    expect(data![0].score).toBe(10)
  })

  it("查：filters 数组（gte）", async () => {
    const r = await supabaseQueryTool.invoke({
      args: {
        parameters: params({
          filters: JSON.stringify([{ op: "gte", column: "score", value: 15 }]),
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { name: string }[] }).data
    expect(Array.isArray(data)).toBe(true)
    expect(data!.some((row: { name: string }) => row.name === "e2e-b")).toBe(
      true,
    )
  })

  it("查：modifiers order_by + limit + offset", async () => {
    const r = await supabaseQueryTool.invoke({
      args: {
        parameters: params({
          order_by: "score.desc",
          limit: 10,
          offset: 0,
          filters: JSON.stringify([
            { op: "ilike", column: "name", value: "e2e-%" },
          ]),
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { name: string; score: number }[] }).data
    expect(Array.isArray(data) && data.length).toBeGreaterThanOrEqual(2)
    const scores = data!.map((row) => row.score)
    expect(scores[0]).toBeGreaterThanOrEqual(scores[1] ?? 0)
  })

  it("改：update 带 filters", async () => {
    const r = await supabaseUpdateTool.invoke({
      args: {
        parameters: params({
          values: JSON.stringify({ score: 11 }),
          filters: JSON.stringify({ name: "e2e-a" }),
          returning: "representation",
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const q = await supabaseQueryTool.invoke({
      args: {
        parameters: params({ filters: JSON.stringify({ name: "e2e-a" }) }),
        credentials: credentials(),
      },
    })
    expect(q.success).toBe(true)
    const data = (q as { data?: { score: number }[] }).data
    expect(Array.isArray(data) && data.length).toBe(1)
    expect(data![0].score).toBe(11)
  })

  it("删：delete 带 filters", async () => {
    const r = await supabaseDeleteTool.invoke({
      args: {
        parameters: params({
          filters: JSON.stringify({ name: "e2e-b" }),
          returning: "representation",
        }),
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const q = await supabaseQueryTool.invoke({
      args: {
        parameters: params({ filters: JSON.stringify({ name: "e2e-b" }) }),
        credentials: credentials(),
      },
    })
    expect(q.success).toBe(true)
    const data = (q as { data?: unknown[] }).data
    expect(Array.isArray(data) && data.length).toBe(0)
  })

  it("RPC：无参 get_e2e_test_count 返回条数", async () => {
    const r = await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "get_e2e_test_count",
          schema: "public",
        },
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = r.data as number | null | undefined
    expect(typeof data).toBe("number")
    expect(Number.isInteger(data)).toBe(true)
    expect((data ?? 0).toString()).not.toBe("NaN")
  })

  it("RPC：带参 e2e_echo 返回传入值", async () => {
    const r = await supabaseRpcTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "e2e_echo",
          args: JSON.stringify({ val: "e2e-rpc-hello" }),
          schema: "public",
        },
        credentials: credentials(),
      },
    })
    expect(r.success).toBe(true)
    const data = r.data as string | null | undefined
    expect(data).toBe("e2e-rpc-hello")
  })
})

describe("e2e: Publishable key (anon)", { skip: !hasAnonEnv }, () => {
  const ROW_NAME = "e2e-pub-a"

  beforeAll(async () => {
    if (!hasAnonEnv) return
    const supabase = createSupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    )
    const { error } = await supabase.from(TABLE).delete().eq("name", ROW_NAME)
    if (error)
      console.warn("e2e Publishable key beforeAll cleanup:", error.message)
  })

  afterAll(async () => {
    if (!hasAnonEnv) return
    const supabase = createSupabaseClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    )
    const { error } = await supabase.from(TABLE).delete().eq("name", ROW_NAME)
    if (error)
      console.warn("e2e Publishable key afterAll cleanup:", error.message)
  })

  it("增：Publishable key insert", async () => {
    const r = await supabaseInsertTool.invoke({
      args: {
        parameters: params({
          rows: JSON.stringify([{ name: ROW_NAME, score: 1 }]),
          returning: "representation",
        }),
        credentials: credentialsAnon(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: unknown[] }).data
    expect(Array.isArray(data) && data.length).toBe(1)
  })

  it("查：Publishable key query + filters", async () => {
    const r = await supabaseQueryTool.invoke({
      args: {
        parameters: params({ filters: JSON.stringify({ name: ROW_NAME }) }),
        credentials: credentialsAnon(),
      },
    })
    expect(r.success).toBe(true)
    const data = (r as { data?: { name: string; score: number }[] }).data
    expect(Array.isArray(data) && data.length).toBe(1)
    expect(data![0].name).toBe(ROW_NAME)
    expect(data![0].score).toBe(1)
  })

  it("改：Publishable key update 带 filters", async () => {
    const r = await supabaseUpdateTool.invoke({
      args: {
        parameters: params({
          values: JSON.stringify({ score: 2 }),
          filters: JSON.stringify({ name: ROW_NAME }),
          returning: "representation",
        }),
        credentials: credentialsAnon(),
      },
    })
    expect(r.success).toBe(true)
    const q = await supabaseQueryTool.invoke({
      args: {
        parameters: params({ filters: JSON.stringify({ name: ROW_NAME }) }),
        credentials: credentialsAnon(),
      },
    })
    expect(q.success).toBe(true)
    const data = (q as { data?: { score: number }[] }).data
    expect(Array.isArray(data) && data.length).toBe(1)
    expect(data![0].score).toBe(2)
  })

  it("删：Publishable key delete 带 filters", async () => {
    const r = await supabaseDeleteTool.invoke({
      args: {
        parameters: params({
          filters: JSON.stringify({ name: ROW_NAME }),
          returning: "representation",
        }),
        credentials: credentialsAnon(),
      },
    })
    expect(r.success).toBe(true)
    const q = await supabaseQueryTool.invoke({
      args: {
        parameters: params({ filters: JSON.stringify({ name: ROW_NAME }) }),
        credentials: credentialsAnon(),
      },
    })
    expect(q.success).toBe(true)
    const data = (q as { data?: unknown[] }).data
    expect(Array.isArray(data) && data.length).toBe(0)
  })
})
