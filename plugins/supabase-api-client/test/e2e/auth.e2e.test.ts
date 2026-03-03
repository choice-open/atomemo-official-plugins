/**
 * E2E：对真实 Supabase 执行认证流程（getSession、signIn、getUser、signOut）。
 * - 需设置 SUPABASE_URL + SUPABASE_KEY（key 才能正确维护客户端 session）；
 * - 需设置 E2E_AUTH_EMAIL + E2E_AUTH_PASSWORD（已存在的测试账号），未设置则跳过整个 suite。
 *
 * 凭证约定：与 getSupabaseClientFromArgs 一致，parameters 中需包含 supabase_credential（凭证 ID），
 * credentials 为以该 ID 为 key 的凭证对象（supabase_url、supabase_key）。params() 已按此约定构造。
 *
 * 建议：在 Supabase Auth 中创建一个测试用户，或在 Dashboard 关闭邮箱确认后 signUp 一个用户，
 * 将邮箱与密码填入 .env 的 E2E_AUTH_EMAIL、E2E_AUTH_PASSWORD。
 */
import "dotenv/config"
import { describe, expect, it } from "vitest"
import { supabaseAuthGetSessionTool } from "../../src/tools/supabase-auth-get-session"
import { supabaseAuthGetUserTool } from "../../src/tools/supabase-auth-get-user"
import { supabaseAuthSignInTool } from "../../src/tools/supabase-auth-sign-in"
import { supabaseAuthSignOutTool } from "../../src/tools/supabase-auth-sign-out"

const CRED_KEY = "supabase_credential"

const hasAnonEnv =
  typeof process.env.SUPABASE_URL === "string" &&
  process.env.SUPABASE_URL.length > 0 &&
  typeof process.env.SUPABASE_KEY === "string" &&
  process.env.SUPABASE_KEY.length > 0

const authEmail =
  typeof process.env.E2E_AUTH_EMAIL === "string" && process.env.E2E_AUTH_EMAIL.length > 0
    ? process.env.E2E_AUTH_EMAIL.trim()
    : ""
const authPassword =
  typeof process.env.E2E_AUTH_PASSWORD === "string" && process.env.E2E_AUTH_PASSWORD.length > 0
    ? process.env.E2E_AUTH_PASSWORD.trim()
    : ""

const hasAuthE2E = hasAnonEnv && authEmail.length > 0 && authPassword.length > 0

function credentials() {
  return {
    [CRED_KEY]: {
      supabase_url: process.env.SUPABASE_URL!,
      supabase_key: process.env.SUPABASE_KEY!,
    },
  }
}

function params(extra: Record<string, unknown> = {}) {
  return { supabase_credential: CRED_KEY, ...extra }
}

type InvokeResult = {
  success: boolean
  data: unknown
  error: string | null
  code: string | null
}

const missingCredError = {
  success: false,
  error: "Missing Supabase credential (supabase_url or supabase_key).",
  data: null,
  code: null,
}

/** 登录后得到的 access_token，供后续 getUser 使用（每次 invoke 新建 client，需显式传 JWT） */
let e2eAccessToken: string | undefined

describe("e2e: Auth getSession / signIn / getUser / signOut", { skip: !hasAuthE2E }, () => {
  it("缺少凭证时返回统一错误（与 getSupabaseClientFromArgs 一致）", async () => {
    const r = (await supabaseAuthGetSessionTool.invoke({
      args: { parameters: {}, credentials: {} },
    })) as InvokeResult
    expect(r).toMatchObject(missingCredError)
  })

  it("未登录时 getSession 返回 success，session 可为 null", async () => {
    const r = (await supabaseAuthGetSessionTool.invoke({
      args: { parameters: params(), credentials: credentials() },
    })) as InvokeResult
    expect(r.success).toBe(true)
    const data = r.data as { session?: unknown } | null | undefined
    expect(data != null).toBe(true)
  })

  it("signInWithPassword 使用 E2E 账号登录", async () => {
    const r = (await supabaseAuthSignInTool.invoke({
      args: {
        parameters: params({ email: authEmail, password: authPassword }),
        credentials: credentials(),
      },
    })) as InvokeResult
    expect(r.success, r.error ?? undefined).toBe(true)
    const data = r.data as { user?: unknown; session?: { access_token?: string } } | null | undefined
    expect(data?.user).toBeDefined()
    expect(data?.session).toBeDefined()
    e2eAccessToken = data?.session?.access_token
  })

  it("登录后 getSession 调用成功（注：每次 invoke 新建 client，session 可能不跨调用）", async () => {
    const r = (await supabaseAuthGetSessionTool.invoke({
      args: { parameters: params(), credentials: credentials() },
    })) as InvokeResult
    expect(r.success).toBe(true)
  })

  it("getUser 调用成功（传入 signIn 返回的 JWT，因每次 invoke 新建 client）", async () => {
    const r = (await supabaseAuthGetUserTool.invoke({
      args: {
        parameters: params(e2eAccessToken ? { jwt: e2eAccessToken } : {}),
        credentials: credentials(),
      },
    })) as InvokeResult
    expect(r.success).toBe(true)
  })

  it("signOut 登出", async () => {
    const r = (await supabaseAuthSignOutTool.invoke({
      args: { parameters: params(), credentials: credentials() },
    })) as InvokeResult
    expect(r.success).toBe(true)
  })

  it("登出后 getSession 调用成功", async () => {
    const r = (await supabaseAuthGetSessionTool.invoke({
      args: { parameters: params(), credentials: credentials() },
    })) as InvokeResult
    expect(r.success).toBe(true)
  })
})
