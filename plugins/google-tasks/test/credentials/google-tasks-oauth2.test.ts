import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

import { googleTasksOAuth2Credential } from "../../src/credentials/google-tasks-oauth2"

describe("googleTasksOAuth2Credential", () => {
  describe("metadata", () => {
    it("should have correct name and oauth2 flag", () => {
      expect(googleTasksOAuth2Credential.name).toBe("google-tasks-oauth2")
      expect(googleTasksOAuth2Credential.oauth2).toBe(true)
    })

    it("should define all required parameters", () => {
      const paramNames = googleTasksOAuth2Credential.parameters.map((p: any) => p.name)
      expect(paramNames).toEqual([
        "client_id",
        "client_secret",
        "access_token",
        "refresh_token",
        "expires_at",
      ])
    })

    it("should mark client_id and client_secret as required", () => {
      const params = googleTasksOAuth2Credential.parameters as any[]
      expect(params.find((p) => p.name === "client_id")?.required).toBe(true)
      expect(params.find((p) => p.name === "client_secret")?.required).toBe(true)
    })
  })

  describe("oauth2_build_authorize_url", () => {
    it("should build a valid Google authorize URL", async () => {
      const result = await googleTasksOAuth2Credential.oauth2_build_authorize_url({
        args: {
          credential: { client_id: "test-client-id" },
          redirect_uri: "https://example.com/callback",
          state: "random-state",
        },
      } as any)

      const url = new URL(result.url)
      expect(url.origin + url.pathname).toBe(
        "https://accounts.google.com/o/oauth2/v2/auth",
      )
      expect(url.searchParams.get("client_id")).toBe("test-client-id")
      expect(url.searchParams.get("redirect_uri")).toBe("https://example.com/callback")
      expect(url.searchParams.get("state")).toBe("random-state")
      expect(url.searchParams.get("response_type")).toBe("code")
      expect(url.searchParams.get("scope")).toBe(
        "https://www.googleapis.com/auth/tasks",
      )
      expect(url.searchParams.get("access_type")).toBe("offline")
      expect(url.searchParams.get("prompt")).toBe("consent")
    })
  })

  describe("oauth2_get_token", () => {
    const mockFetch = vi.fn()

    beforeEach(() => {
      vi.stubGlobal("fetch", mockFetch)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it("should exchange code for tokens on success", async () => {
      const now = Math.floor(Date.now() / 1000)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_in: 3600,
        }),
      })

      const result = await googleTasksOAuth2Credential.oauth2_get_token({
        args: {
          credential: { client_id: "cid", client_secret: "csecret" },
          code: "auth-code",
          redirect_uri: "https://example.com/callback",
        },
      } as any)

      expect(result.parameters_patch.access_token).toBe("new-access-token")
      expect(result.parameters_patch.refresh_token).toBe("new-refresh-token")
      expect(result.parameters_patch.expires_at).toBeGreaterThanOrEqual(now + 3599)
      expect(result.parameters_patch.expires_at).toBeLessThanOrEqual(now + 3601)

      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toBe("https://oauth2.googleapis.com/token")
      expect(options.method).toBe("POST")
      const body = new URLSearchParams(options.body)
      expect(body.get("grant_type")).toBe("authorization_code")
      expect(body.get("code")).toBe("auth-code")
    })

    it("should throw on error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "invalid_grant",
          error_description: "Code has expired",
        }),
      })

      await expect(
        googleTasksOAuth2Credential.oauth2_get_token({
          args: {
            credential: { client_id: "cid", client_secret: "csecret" },
            code: "bad-code",
            redirect_uri: "https://example.com/callback",
          },
        } as any),
      ).rejects.toThrow("Code has expired")
    })
  })

  describe("oauth2_refresh_token", () => {
    const mockFetch = vi.fn()

    beforeEach(() => {
      vi.stubGlobal("fetch", mockFetch)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it("should refresh the access token", async () => {
      const now = Math.floor(Date.now() / 1000)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: "refreshed-token",
          expires_in: 3600,
        }),
      })

      const result = await googleTasksOAuth2Credential.oauth2_refresh_token({
        args: {
          credential: {
            client_id: "cid",
            client_secret: "csecret",
            refresh_token: "rt",
          },
        },
      } as any)

      expect(result.parameters_patch.access_token).toBe("refreshed-token")
      expect(result.parameters_patch.expires_at).toBeGreaterThanOrEqual(now + 3599)

      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body)
      expect(body.get("grant_type")).toBe("refresh_token")
      expect(body.get("refresh_token")).toBe("rt")
    })

    it("should throw on error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "invalid_grant",
          error_description: "Token has been revoked",
        }),
      })

      await expect(
        googleTasksOAuth2Credential.oauth2_refresh_token({
          args: {
            credential: {
              client_id: "cid",
              client_secret: "csecret",
              refresh_token: "bad-rt",
            },
          },
        } as any),
      ).rejects.toThrow("Token has been revoked")
    })
  })
})
