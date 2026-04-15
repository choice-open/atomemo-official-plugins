import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const MS_SCOPE =
  "email offline_access openid profile https://graph.microsoft.com/Calendars.ReadWrite.Shared User.Read"

function resolveTenantSegment(credential: Record<string, unknown>): string {
  if (!credential.tenant_id) {
    throw new Error("tenant_id is required")
  }

  return String(credential.tenant_id).trim()
}

function authorizationEndpoint(segment: string): string {
  return `https://login.microsoftonline.com/${segment}/oauth2/v2.0/authorize`
}

function tokenEndpoint(segment: string): string {
  return `https://login.microsoftonline.com/${segment}/oauth2/v2.0/token`
}

export const microsoft365OAuth2Credential = {
  name: "microsoft-365-oauth2",
  display_name: t("M365_CREDENTIAL_DISPLAY_NAME"),
  description: t("M365_CREDENTIAL_DESCRIPTION"),
  icon: "🔑",
  oauth2: true,
  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: t("M365_CLIENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        width: "full",
        placeholder: t("M365_CLIENT_ID_PLACEHOLDER"),
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: t("M365_CLIENT_SECRET_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        width: "full",
        placeholder: t("M365_CLIENT_SECRET_PLACEHOLDER"),
      },
    },
    {
      name: "tenant_id",
      type: "string",
      required: true,
      display_name: t("M365_CUSTOM_TENANT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        width: "full",
        placeholder: t("M365_CUSTOM_TENANT_ID_PLACEHOLDER"),
      },
    },
    { name: "access_token", type: "encrypted_string" },
    { name: "refresh_token", type: "encrypted_string" },
    { name: "expires_at", type: "integer" },
  ],
  async oauth2_build_authorize_url({ args }) {
    const segment = resolveTenantSegment(
      args.credential as Record<string, unknown>,
    )
    const clientId = String(args.credential.client_id ?? "")
    const { redirect_uri, state } = args

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri,
      scope: MS_SCOPE,
      response_mode: "query",
      prompt: "consent",
      state,
    })

    return { url: `${authorizationEndpoint(segment)}?${params.toString()}` }
  },
  async oauth2_get_token({ args }) {
    const segment = resolveTenantSegment(
      args.credential as Record<string, unknown>,
    )
    const clientId = String(args.credential.client_id ?? "")
    const clientSecret = String(args.credential.client_secret ?? "")
    const { code, redirect_uri } = args

    const response = await fetch(tokenEndpoint(segment), {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri,
        grant_type: "authorization_code",
        scope: MS_SCOPE,
      }).toString(),
    })

    const data = (await response.json()) as Record<string, string>

    if (!response.ok) {
      throw new Error(
        `Failed to get token: ${data.error_description || data.error}`,
      )
    }

    return {
      parameters_patch: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in),
      },
    }
  },
  async oauth2_refresh_token({ args }) {
    const segment = resolveTenantSegment(
      args.credential as Record<string, unknown>,
    )
    const clientId = String(args.credential.client_id ?? "")
    const clientSecret = String(args.credential.client_secret ?? "")
    const refreshToken = String(args.credential.refresh_token ?? "")

    const response = await fetch(tokenEndpoint(segment), {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        scope: MS_SCOPE,
      }).toString(),
    })

    const data = (await response.json()) as Record<string, string>

    if (!response.ok) {
      throw new Error(
        `Failed to refresh token: ${data.error_description || data.error}`,
      )
    }

    return {
      parameters_patch: {
        access_token: data.access_token,
        refresh_token: data.refresh_token ?? refreshToken,
        expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in),
      },
    }
  },
} satisfies CredentialDefinition
