import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

import { microsoft365OAuth2Credential } from "../../src/credentials/microsoft-365-oauth2"

const MS_SCOPE =
  "email offline_access openid profile https://graph.microsoft.com/Calendars.ReadWrite.Shared User.Read"

describe("microsoft365OAuth2Credential", () => {
  describe("metadata", () => {
    it("should have correct name and oauth2 flag", () => {
      expect(microsoft365OAuth2Credential.name).toBe("microsoft-365-oauth2")
      expect(microsoft365OAuth2Credential.oauth2).toBe(true)
    })

    it("should define expected parameters", () => {
      const paramNames = microsoft365OAuth2Credential.parameters.map(
        (p: { name: string }) => p.name,
      )
      expect(paramNames).toEqual([
        "client_id",
        "client_secret",
        "tenant_id",
        "access_token",
        "refresh_token",
        "expires_at",
      ])
    })

    it("should mark client_id and client_secret as required", () => {
      const params = microsoft365OAuth2Credential.parameters as {
        name: string
        required?: boolean
      }[]
      expect(params.find((p) => p.name === "client_id")?.required).toBe(true)
      expect(params.find((p) => p.name === "client_secret")?.required).toBe(
        true,
      )
    })
  })

  describe("oauth2_build_authorize_url", () => {
    it("should build a valid Microsoft authorize URL", async () => {
      const result =
        await microsoft365OAuth2Credential.oauth2_build_authorize_url({
          args: {
            credential: {
              client_id: "test-client-id",
              tenant_id: "contoso.onmicrosoft.com",
            },
            redirect_uri: "https://example.com/callback",
            state: "random-state",
          },
        } as never)

      const url = new URL(result.url)
      expect(url.origin + url.pathname).toBe(
        "https://login.microsoftonline.com/contoso.onmicrosoft.com/oauth2/v2.0/authorize",
      )
      expect(url.searchParams.get("client_id")).toBe("test-client-id")
      expect(url.searchParams.get("redirect_uri")).toBe(
        "https://example.com/callback",
      )
      expect(url.searchParams.get("state")).toBe("random-state")
      expect(url.searchParams.get("response_type")).toBe("code")
      expect(url.searchParams.get("scope")).toBe(MS_SCOPE)
      expect(url.searchParams.get("response_mode")).toBe("query")
      expect(url.searchParams.get("prompt")).toBe("consent")
    })

    it("should trim tenant_id", async () => {
      const result =
        await microsoft365OAuth2Credential.oauth2_build_authorize_url({
          args: {
            credential: {
              client_id: "cid",
              tenant_id: "  my-tenant  ",
            },
            redirect_uri: "https://cb",
            state: "s",
          },
        } as never)

      expect(result.url).toContain(
        "https://login.microsoftonline.com/my-tenant/oauth2/v2.0/authorize",
      )
    })

    it("should throw when tenant_id is missing", async () => {
      await expect(
        microsoft365OAuth2Credential.oauth2_build_authorize_url({
          args: {
            credential: { client_id: "cid" },
            redirect_uri: "https://cb",
            state: "s",
          },
        } as never),
      ).rejects.toThrow("tenant_id is required")
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

      const result = await microsoft365OAuth2Credential.oauth2_get_token({
        args: {
          credential: {
            client_id: "cid",
            client_secret: "csecret",
            tenant_id: "tid",
          },
          code: "auth-code",
          redirect_uri: "https://example.com/callback",
        },
      } as never)

      expect(result.parameters_patch.access_token).toBe("new-access-token")
      expect(result.parameters_patch.refresh_token).toBe("new-refresh-token")
      expect(result.parameters_patch.expires_at).toBeGreaterThanOrEqual(
        now + 3599,
      )
      expect(result.parameters_patch.expires_at).toBeLessThanOrEqual(now + 3601)

      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toBe(
        "https://login.microsoftonline.com/tid/oauth2/v2.0/token",
      )
      expect(options.method).toBe("POST")
      const body = new URLSearchParams(options.body)
      expect(body.get("grant_type")).toBe("authorization_code")
      expect(body.get("code")).toBe("auth-code")
      expect(body.get("scope")).toBe(MS_SCOPE)
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
        microsoft365OAuth2Credential.oauth2_get_token({
          args: {
            credential: {
              client_id: "cid",
              client_secret: "csecret",
              tenant_id: "tid",
            },
            code: "bad-code",
            redirect_uri: "https://example.com/callback",
          },
        } as never),
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
          refresh_token: "new-rt",
          expires_in: 3600,
        }),
      })

      const result = await microsoft365OAuth2Credential.oauth2_refresh_token({
        args: {
          credential: {
            client_id: "cid",
            client_secret: "csecret",
            tenant_id: "tid",
            refresh_token: "rt",
          },
        },
      } as never)

      expect(result.parameters_patch.access_token).toBe("refreshed-token")
      expect(result.parameters_patch.refresh_token).toBe("new-rt")
      expect(result.parameters_patch.expires_at).toBeGreaterThanOrEqual(
        now + 3599,
      )

      const body = new URLSearchParams(mockFetch.mock.calls[0][1].body)
      expect(body.get("grant_type")).toBe("refresh_token")
      expect(body.get("refresh_token")).toBe("rt")
      expect(body.get("scope")).toBe(MS_SCOPE)
    })

    it("should keep previous refresh_token when response omits it", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: "refreshed-token",
          expires_in: 3600,
        }),
      })

      const result = await microsoft365OAuth2Credential.oauth2_refresh_token({
        args: {
          credential: {
            client_id: "cid",
            client_secret: "csecret",
            tenant_id: "tid",
            refresh_token: "existing-rt",
          },
        },
      } as never)

      expect(result.parameters_patch.refresh_token).toBe("existing-rt")
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
        microsoft365OAuth2Credential.oauth2_refresh_token({
          args: {
            credential: {
              client_id: "cid",
              client_secret: "csecret",
              tenant_id: "tid",
              refresh_token: "bad-rt",
            },
          },
        } as never),
      ).rejects.toThrow("Token has been revoked")
    })
  })
})
