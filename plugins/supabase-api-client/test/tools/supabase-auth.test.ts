/**
 * 认证相关工具单元测试：mock Supabase client.auth，验证凭证缺失、参数校验与 API 调用。
 */
import { beforeEach, describe, expect, it, vi } from "vitest"
import { supabaseAuthGetSessionTool } from "../../src/tools/supabase-auth-get-session"
import { supabaseAuthGetUserTool } from "../../src/tools/supabase-auth-get-user"
import { supabaseAuthGetClaimsTool } from "../../src/tools/supabase-auth-get-claims"
import { supabaseAuthResetPasswordTool } from "../../src/tools/supabase-auth-reset-password"
import { supabaseAuthSetSessionTool } from "../../src/tools/supabase-auth-set-session"
import { supabaseAuthSignInAnonymouslyTool } from "../../src/tools/supabase-auth-sign-in-anonymously"
import { supabaseAuthSignInTool } from "../../src/tools/supabase-auth-sign-in"
import { supabaseAuthSignOutTool } from "../../src/tools/supabase-auth-sign-out"
import { supabaseAuthSignUpTool } from "../../src/tools/supabase-auth-sign-up"

const mockGetSession = vi.fn()
const mockGetUser = vi.fn()
const mockSignInWithPassword = vi.fn()
const mockSignOut = vi.fn()
const mockSignUp = vi.fn()
const mockResetPasswordForEmail = vi.fn()
const mockGetClaims = vi.fn()
const mockSetSession = vi.fn()
const mockSignInAnonymously = vi.fn()

const mockAuth = {
  getSession: mockGetSession,
  getUser: mockGetUser,
  signInWithPassword: mockSignInWithPassword,
  signOut: mockSignOut,
  signUp: mockSignUp,
  resetPasswordForEmail: mockResetPasswordForEmail,
  getClaims: mockGetClaims,
  setSession: mockSetSession,
  signInAnonymously: mockSignInAnonymously,
}

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ auth: mockAuth })),
}))

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

describe("Auth tools – credential and API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    mockSignInWithPassword.mockResolvedValue({ data: { user: {}, session: {} }, error: null })
    mockSignOut.mockResolvedValue({ error: null })
    mockSignUp.mockResolvedValue({ data: { user: {}, session: null }, error: null })
    mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: null })
    mockGetClaims.mockResolvedValue({ data: { claims: {}, header: {} }, error: null })
    mockSetSession.mockResolvedValue({ data: { user: {}, session: {} }, error: null })
    mockSignInAnonymously.mockResolvedValue({ data: { user: {}, session: {} }, error: null })
  })

  describe("supabase-auth-get-session", () => {
    it("has correct name and requires supabase_credential", () => {
      expect(supabaseAuthGetSessionTool.name).toBe("supabase-auth-get-session")
      const names = supabaseAuthGetSessionTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthGetSessionTool.invoke(args({}, {}))
      expect(r).toMatchObject(missingCredError)
      expect(mockGetSession).not.toHaveBeenCalled()
    })
    it("calls getSession and returns success when credential provided", async () => {
      const r = await supabaseAuthGetSessionTool.invoke(args({}))
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockGetSession).toHaveBeenCalled()
    })
  })

  describe("supabase-auth-get-user", () => {
    it("has correct name and params", () => {
      expect(supabaseAuthGetUserTool.name).toBe("supabase-auth-get-user")
      const names = supabaseAuthGetUserTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("jwt")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthGetUserTool.invoke(args({}, {}))
      expect(r).toMatchObject(missingCredError)
      expect(mockGetUser).not.toHaveBeenCalled()
    })
    it("calls getUser and returns success", async () => {
      const r = await supabaseAuthGetUserTool.invoke(args({}))
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockGetUser).toHaveBeenCalledWith(undefined)
    })
    it("passes jwt to getUser when provided", async () => {
      await supabaseAuthGetUserTool.invoke(args({ jwt: "eyJhbG..." }))
      expect(mockGetUser).toHaveBeenCalledWith("eyJhbG...")
    })
  })

  describe("supabase-auth-sign-in", () => {
    it("has correct name and params", () => {
      expect(supabaseAuthSignInTool.name).toBe("supabase-auth-sign-in")
      const names = supabaseAuthSignInTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("email")
      expect(names).toContain("password")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthSignInTool.invoke(
        args({ email: "a@b.co", password: "pwd" }, {}),
      )
      expect(r).toMatchObject(missingCredError)
      expect(mockSignInWithPassword).not.toHaveBeenCalled()
    })
    it("returns error when email or password empty", async () => {
      const r1 = await supabaseAuthSignInTool.invoke(args({ email: "", password: "pwd" }))
      expect(r1).toMatchObject({ success: false, error: "Email and password are required." })
      const r2 = await supabaseAuthSignInTool.invoke(args({ email: "a@b.co", password: "" }))
      expect(r2).toMatchObject({ success: false, error: "Email and password are required." })
      expect(mockSignInWithPassword).not.toHaveBeenCalled()
    })
    it("calls signInWithPassword with email and password", async () => {
      const r = await supabaseAuthSignInTool.invoke(
        args({ email: "u@example.com", password: "secret" }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "u@example.com",
        password: "secret",
      })
    })
  })

  describe("supabase-auth-sign-out", () => {
    it("has correct name and params", () => {
      expect(supabaseAuthSignOutTool.name).toBe("supabase-auth-sign-out")
      const names = supabaseAuthSignOutTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("scope")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthSignOutTool.invoke(args({}, {}))
      expect(r).toMatchObject(missingCredError)
      expect(mockSignOut).not.toHaveBeenCalled()
    })
    it("calls signOut with default scope local", async () => {
      const r = await supabaseAuthSignOutTool.invoke(args({}))
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockSignOut).toHaveBeenCalledWith({ scope: "local" })
    })
    it("calls signOut with scope global when parameters.scope is global", async () => {
      await supabaseAuthSignOutTool.invoke(args({ scope: "global" }))
      expect(mockSignOut).toHaveBeenCalledWith({ scope: "global" })
    })
  })

  describe("supabase-auth-sign-up", () => {
    it("has correct name and params", () => {
      expect(supabaseAuthSignUpTool.name).toBe("supabase-auth-sign-up")
      const names = supabaseAuthSignUpTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("email")
      expect(names).toContain("password")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthSignUpTool.invoke(
        args({ email: "a@b.co", password: "pwd" }, {}),
      )
      expect(r).toMatchObject(missingCredError)
      expect(mockSignUp).not.toHaveBeenCalled()
    })
    it("returns error when email or password empty", async () => {
      const r = await supabaseAuthSignUpTool.invoke(args({ email: "", password: "pwd" }))
      expect(r).toMatchObject({ success: false, error: "Email and password are required." })
      expect(mockSignUp).not.toHaveBeenCalled()
    })
    it("calls signUp with email and password", async () => {
      const r = await supabaseAuthSignUpTool.invoke(
        args({ email: "new@example.com", password: "secret" }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "secret",
        options: {},
      })
    })
  })

  describe("supabase-auth-reset-password", () => {
    it("has correct name and params", () => {
      expect(supabaseAuthResetPasswordTool.name).toBe("supabase-auth-reset-password")
      const names = supabaseAuthResetPasswordTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("email")
      expect(names).toContain("redirect_to")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthResetPasswordTool.invoke(
        args({ email: "a@b.co" }, {}),
      )
      expect(r).toMatchObject(missingCredError)
      expect(mockResetPasswordForEmail).not.toHaveBeenCalled()
    })
    it("returns error when email empty", async () => {
      const r = await supabaseAuthResetPasswordTool.invoke(args({ email: "   " }))
      expect(r).toMatchObject({ success: false, error: "Email is required." })
      expect(mockResetPasswordForEmail).not.toHaveBeenCalled()
    })
    it("calls resetPasswordForEmail with email and optional redirectTo", async () => {
      const r = await supabaseAuthResetPasswordTool.invoke(
        args({ email: "u@example.com", redirect_to: "https://app.com/reset" }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith("u@example.com", {
        redirectTo: "https://app.com/reset",
      })
    })
  })

  describe("supabase-auth-get-claims", () => {
    it("has correct name and params", () => {
      expect(supabaseAuthGetClaimsTool.name).toBe("supabase-auth-get-claims")
      const names = supabaseAuthGetClaimsTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("jwt")
      expect(names).toContain("allow_expired")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthGetClaimsTool.invoke(args({}, {}))
      expect(r).toMatchObject(missingCredError)
      expect(mockGetClaims).not.toHaveBeenCalled()
    })
    it("calls getClaims with optional jwt and allowExpired", async () => {
      const r = await supabaseAuthGetClaimsTool.invoke(args({ allow_expired: true }))
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockGetClaims).toHaveBeenCalledWith(undefined, { allowExpired: true })
    })
  })

  describe("supabase-auth-set-session", () => {
    it("has correct name and params", () => {
      expect(supabaseAuthSetSessionTool.name).toBe("supabase-auth-set-session")
      const names = supabaseAuthSetSessionTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
      expect(names).toContain("access_token")
      expect(names).toContain("refresh_token")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthSetSessionTool.invoke(
        args({ access_token: "at", refresh_token: "rt" }, {}),
      )
      expect(r).toMatchObject(missingCredError)
      expect(mockSetSession).not.toHaveBeenCalled()
    })
    it("returns error when access_token or refresh_token empty", async () => {
      const r = await supabaseAuthSetSessionTool.invoke(
        args({ access_token: "", refresh_token: "rt" }),
      )
      expect(r).toMatchObject({
        success: false,
        error: "access_token and refresh_token are required.",
      })
      expect(mockSetSession).not.toHaveBeenCalled()
    })
    it("calls setSession with access_token and refresh_token", async () => {
      const r = await supabaseAuthSetSessionTool.invoke(
        args({ access_token: "access", refresh_token: "refresh" }),
      )
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockSetSession).toHaveBeenCalledWith({
        access_token: "access",
        refresh_token: "refresh",
      })
    })
  })

  describe("supabase-auth-sign-in-anonymously", () => {
    it("has correct name and params", () => {
      expect(supabaseAuthSignInAnonymouslyTool.name).toBe("supabase-auth-sign-in-anonymously")
      const names = supabaseAuthSignInAnonymouslyTool.parameters.map((p) => p.name)
      expect(names).toContain("supabase_credential")
    })
    it("returns error when credential missing", async () => {
      const r = await supabaseAuthSignInAnonymouslyTool.invoke(args({}, {}))
      expect(r).toMatchObject(missingCredError)
      expect(mockSignInAnonymously).not.toHaveBeenCalled()
    })
    it("calls signInAnonymously and returns success", async () => {
      const r = await supabaseAuthSignInAnonymouslyTool.invoke(args({}))
      expect(r).toMatchObject({ success: true, error: null })
      expect(mockSignInAnonymously).toHaveBeenCalled()
    })
  })
})
