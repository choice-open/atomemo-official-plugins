/**
 * Edge Function E2E 测试 - 需要 Supabase 项目已部署 Edge Function
 * 设置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 环境变量
 */
import { describe, expect, it } from "vitest"
import { supabaseInvokeEdgeFunctionTool } from "../../src/tools/edge/supabase-invoke-edge-function"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const CRED_ID = "e2e-cred"
const credentials =
  SUPABASE_URL &&
  SUPABASE_KEY && {
    [CRED_ID]: {
      supabase_url: SUPABASE_URL,
      supabase_key: SUPABASE_KEY,
      supabase_service_role_key: SUPABASE_KEY,
    },
  }

const skipE2E = !credentials

describe("Edge Function E2E", { skip: skipE2E }, () => {
  it("调用 hello-world 类 Edge Function", async () => {
    const result = await supabaseInvokeEdgeFunctionTool.invoke({
      args: {
        parameters: {
          supabase_credential: CRED_ID,
          function_name: "hello-world",
          body: JSON.stringify({ name: "e2e" }),
        },
        credentials: credentials!,
      },
    } as any)

    expect(result).toMatchObject({ success: true })
  })
})
