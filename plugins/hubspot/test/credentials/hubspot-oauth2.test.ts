import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

import { hubspotOAuth2Credential } from "../../src/credentials/hubspot-oauth2"

describe("hubspotOAuth2Credential", () => {
  it("defines a read-only scopes parameter that includes required and optional scopes", () => {
    const scopesParam = hubspotOAuth2Credential.parameters.find(
      (param: { name: string }) => param.name === "scopes",
    ) as
      | {
        type: string
        constant?: string
        ui?: { component?: string; readonly?: boolean }
      }
      | undefined

    expect(scopesParam).toBeDefined()
    expect(scopesParam?.type).toBe("string")
    expect(scopesParam?.ui?.component).toBe("textarea")
    expect(scopesParam?.ui?.readonly).toBe(true)
    expect(scopesParam?.constant).toContain("crm.objects.contacts.read")
    expect(scopesParam?.constant).toContain("communication_preferences.read_write")
    expect(scopesParam?.constant).toContain("crm.schemas.custom.read")
  })

  it("builds the authorize URL with space-separated scope parameters", async () => {
    const result = await hubspotOAuth2Credential.oauth2_build_authorize_url({
      args: {
        credential: { client_id: "client-id" },
        redirect_uri: "https://example.com/oauth/callback",
        state: "test-state",
      },
    } as never)

    const url = new URL(result.url)
    const scope = url.searchParams.get("scope") ?? ""
    const optionalScope = url.searchParams.get("optional_scope") ?? ""

    expect(scope).toContain("crm.objects.contacts.read")
    expect(scope).toContain("crm.objects.contacts.write")
    expect(scope).toContain("communication_preferences.read_write")
    expect(scope).toContain("crm.schemas.custom.read")
    expect(scope).not.toContain(",")
    expect(optionalScope).toBe("")
  })

  describe("oauth2_get_token", () => {
    const mockFetch = vi.fn()
    const originalFetch = globalThis.fetch

    beforeEach(() => {
      globalThis.fetch = mockFetch as typeof fetch
    })

    afterEach(() => {
      globalThis.fetch = originalFetch
    })

    it("uses the HubSpot v3 token endpoint for authorization code exchange", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: "access-token",
          refresh_token: "refresh-token",
          expires_in: 1800,
        }),
      })

      const result = await hubspotOAuth2Credential.oauth2_get_token({
        args: {
          credential: {
            client_id: "client-id",
            client_secret: "client-secret",
          },
          code: "auth-code",
          redirect_uri: "https://example.com/oauth/callback",
        },
      } as never)

      expect(result.parameters_patch.access_token).toBe("access-token")
      expect(result.parameters_patch.refresh_token).toBe("refresh-token")

      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toBe("https://api.hubapi.com/oauth/v3/token")
      expect(options.method).toBe("POST")

      const body = options.body as URLSearchParams
      expect(body.get("grant_type")).toBe("authorization_code")
      expect(body.get("client_id")).toBe("client-id")
      expect(body.get("client_secret")).toBe("client-secret")
      expect(body.get("code")).toBe("auth-code")
      expect(body.get("redirect_uri")).toBe("https://example.com/oauth/callback")
    })

    it("prefers OAuth error details when token exchange fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "invalid_grant",
          error_description: "authorization code expired",
        }),
      })

      await expect(
        hubspotOAuth2Credential.oauth2_get_token({
          args: {
            credential: {
              client_id: "client-id",
              client_secret: "client-secret",
            },
            code: "bad-code",
            redirect_uri: "https://example.com/oauth/callback",
          },
        } as never),
      ).rejects.toThrow("authorization code expired")
    })

    it("throws when the access_token is missing", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          refresh_token: "refresh-token",
          expires_in: 1800,
        }),
      })

      await expect(
        hubspotOAuth2Credential.oauth2_get_token({
          args: {
            credential: {
              client_id: "client-id",
              client_secret: "client-secret",
            },
            code: "auth-code",
            redirect_uri: "https://example.com/oauth/callback",
          },
        } as never),
      ).rejects.toThrow("access_token is missing")
    })
  })

  describe("oauth2_refresh_token", () => {
    const mockFetch = vi.fn()
    const originalFetch = globalThis.fetch

    beforeEach(() => {
      globalThis.fetch = mockFetch as typeof fetch
    })

    afterEach(() => {
      globalThis.fetch = originalFetch
    })

    it("uses the HubSpot v3 token endpoint for refresh and preserves redirect_uri", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: "refreshed-access-token",
          expires_in: 1800,
        }),
      })

      const result = await hubspotOAuth2Credential.oauth2_refresh_token({
        args: {
          credential: {
            client_id: "client-id",
            client_secret: "client-secret",
            refresh_token: "existing-refresh-token",
          },
          redirect_uri: "https://example.com/oauth/callback",
        },
      } as never)

      expect(result.parameters_patch.access_token).toBe("refreshed-access-token")
      expect(result.parameters_patch.refresh_token).toBe("existing-refresh-token")

      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toBe("https://api.hubapi.com/oauth/v3/token")

      const body = options.body as URLSearchParams
      expect(body.get("grant_type")).toBe("refresh_token")
      expect(body.get("refresh_token")).toBe("existing-refresh-token")
      expect(body.get("redirect_uri")).toBe("https://example.com/oauth/callback")
    })
  })
})
