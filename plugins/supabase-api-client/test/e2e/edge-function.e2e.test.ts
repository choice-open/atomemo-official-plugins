/**
 * E2E：对真实 Supabase 调用 Edge Function。
 * - 需设置 SUPABASE_URL + SUPABASE_KEY；
 * - 需设置 EDGE_FUNCTION_NAME（已部署的函数名，如 "hello"），并设置 RUN_EDGE_FUNCTION_E2E=1 才会执行，否则跳过。
 *
 * 建议：部署默认 hello 函数后设置 EDGE_FUNCTION_NAME=hello 与 RUN_EDGE_FUNCTION_E2E=1。
 * 默认 hello 接受 POST JSON body { "name": "xxx" } 并返回 { "message": "Hello xxx!" }。
 * 若未部署该函数或名称不符，invoke 会返回 success: false（如 Function not found）。
 * 若报 "Edge Function returned a non-2xx status code"：请确认函数返回 HTTP 200 且 body 为 JSON；
 * 在 Supabase 控制台 → Edge Functions → 该函数 → Logs 查看实际状态码与错误。
 */
import "dotenv/config"
import { describe, expect, it } from "vitest"
import { supabaseInvokeEdgeFunctionTool } from "../../src/tools/supabase-invoke-edge-function"

const CRED_ID = "e2e_cred"

const hasEnv =
  typeof process.env.SUPABASE_URL === "string" &&
  process.env.SUPABASE_URL.length > 0 &&
  typeof process.env.SUPABASE_KEY === "string" &&
  process.env.SUPABASE_KEY.length > 0

const functionName =
  typeof process.env.EDGE_FUNCTION_NAME === "string" &&
  process.env.EDGE_FUNCTION_NAME.length > 0
    ? process.env.EDGE_FUNCTION_NAME.trim()
    : ""

const runEdgeE2E = process.env.RUN_EDGE_FUNCTION_E2E === "1"
const hasEdgeFunction = hasEnv && functionName.length > 0 && runEdgeE2E

function credentials() {
  const serviceRoleKey =
    typeof process.env.SUPABASE_SERVICE_ROLE_KEY === "string" &&
    process.env.SUPABASE_SERVICE_ROLE_KEY.length > 0
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : undefined
  return {
    [CRED_ID]: {
      supabase_url: process.env.SUPABASE_URL!,
      supabase_key: process.env.SUPABASE_KEY!,
      ...(serviceRoleKey && { supabase_service_role_key: serviceRoleKey }),
    },
  }
}

function params(extra: Record<string, unknown> = {}) {
  return {
    supabase_credential: CRED_ID,
    function_name: functionName,
    ...extra,
  }
}

type InvokeResult = {
  success: boolean
  data: unknown
  error: string | null
  code: string | null
}

describe("e2e: Edge Function 调用", { skip: !hasEdgeFunction }, () => {
  it("POST 调用（带 JSON body）", async () => {
    const r = (await supabaseInvokeEdgeFunctionTool.invoke({
      args: {
        parameters: params({
          body: JSON.stringify({ name: "e2e" }),
          method: "POST",
        }),
        credentials: credentials(),
      },
    })) as InvokeResult
    expect(r.success, r.error ?? undefined).toBe(true)
    const data = r.data as { message?: string } | null | undefined
    if (data != null && typeof data.message === "string") {
      expect(data.message).toContain("Hello")
      expect(data.message).toContain("e2e")
    }
  })

  it("POST 调用（空 body {}，避免 req.json() 报错）", async () => {
    const r = (await supabaseInvokeEdgeFunctionTool.invoke({
      args: {
        parameters: params({ body: "{}", method: "POST" }),
        credentials: credentials(),
      },
    })) as InvokeResult
    expect(r.success, r.error ?? undefined).toBe(true)
  })

  it.skip("GET 调用（默认 hello 常不支持 GET，可按需取消 skip）", async () => {
    const r = (await supabaseInvokeEdgeFunctionTool.invoke({
      args: {
        parameters: params({ method: "GET" }),
        credentials: credentials(),
      },
    })) as InvokeResult
    expect(r.success, r.error ?? undefined).toBe(true)
  })

  it("调用时传入自定义 headers", async () => {
    const r = (await supabaseInvokeEdgeFunctionTool.invoke({
      args: {
        parameters: params({
          body: JSON.stringify({ name: "e2e-headers" }),
          method: "POST",
          headers: JSON.stringify({ "X-E2E": "true" }),
        }),
        credentials: credentials(),
      },
    })) as InvokeResult
    expect(r.success, r.error ?? undefined).toBe(true)
  })
})
