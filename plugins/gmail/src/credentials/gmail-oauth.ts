import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const GMAIL_OAUTH_SCOPES = [
  // Read mailbox
  "https://www.googleapis.com/auth/gmail.readonly",
  // Manage mailbox (labels, trash, etc.)
  "https://www.googleapis.com/auth/gmail.modify",
  // Compose + send
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
  // Settings
  "https://www.googleapis.com/auth/gmail.settings.basic",
  "https://www.googleapis.com/auth/gmail.settings.sharing",
]

export const gmailOAuthCredential = {
  name: "gmail-oauth",
  display_name: t("GMAIL_CREDENTIAL_DISPLAY_NAME"),
  description: t("GMAIL_CREDENTIAL_DESCRIPTION"),
  icon: "📧",
  oauth2: true,
  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: t("GMAIL_CREDENTIAL_CLIENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("GMAIL_CREDENTIAL_CLIENT_ID_HINT"),
        width: "full",
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: t("GMAIL_CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("GMAIL_CREDENTIAL_CLIENT_SECRET_HINT"),
        width: "full",
      },
    },
    // Internal OAuth2 fields (must exist in schema; typically hidden in UI)
    {
      name: "access_token",
      type: "encrypted_string",
      required: false,
      display_name: t("GMAIL_CREDENTIAL_ACCESS_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("GMAIL_CREDENTIAL_ACCESS_TOKEN_HINT"),
        placeholder: t("GMAIL_CREDENTIAL_ACCESS_TOKEN_PLACEHOLDER"),
        width: "full",
        display_none: true,
      },
    },
    {
      name: "refresh_token",
      type: "encrypted_string",
      required: false,
      display_name: t("GMAIL_CREDENTIAL_REFRESH_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("GMAIL_CREDENTIAL_REFRESH_TOKEN_HINT"),
        width: "full",
        display_none: true,
      },
    },
    {
      name: "expires_at",
      type: "integer",
      required: false,
      display_name: t("GMAIL_CREDENTIAL_EXPIRES_AT_DISPLAY_NAME"),
      ui: { component: "number-input", display_none: true },
    },
  ],

  async oauth2_build_authorize_url({ args }) {
    const { client_id } = args.credential as { client_id?: string }
    const { redirect_uri, state } = args
    if (!client_id) throw new Error("client_id is required.")

    const params = new URLSearchParams({
      client_id,
      redirect_uri,
      state,
      response_type: "code",
      scope: GMAIL_OAUTH_SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent",
    })

    return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` }
  },

  async oauth2_get_token({ args }) {
    const { client_id, client_secret } = args.credential as {
      client_id?: string
      client_secret?: string
    }
    const { code, redirect_uri } = args
    if (!client_id) throw new Error("client_id is required.")
    if (!client_secret) throw new Error("client_secret is required.")

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id,
        client_secret,
        code,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    })

    const data = (await response.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      error?: string
      error_description?: string
    }

    if (!response.ok) {
      throw new Error(`获取 Token 失败: ${data.error_description || data.error || "unknown_error"}`)
    }

    return {
      parameters_patch: {
        access_token: data.access_token ?? "",
        refresh_token: data.refresh_token ?? "",
        expires_at:
          typeof data.expires_in === "number"
            ? Math.floor(Date.now() / 1000) + data.expires_in
            : undefined,
      },
    }
  },

  async oauth2_refresh_token({ args }) {
    const { client_id, client_secret, refresh_token } = args.credential as {
      client_id?: string
      client_secret?: string
      refresh_token?: string
    }
    if (!client_id) throw new Error("client_id is required.")
    if (!client_secret) throw new Error("client_secret is required.")
    if (!refresh_token) throw new Error("refresh_token is required.")

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id,
        client_secret,
        refresh_token,
        grant_type: "refresh_token",
      }),
    })

    const data = (await response.json()) as {
      access_token?: string
      expires_in?: number
      error?: string
      error_description?: string
    }

    if (!response.ok) {
      throw new Error(`刷新 Token 失败: ${data.error_description || data.error || "unknown_error"}`)
    }

    return {
      parameters_patch: {
        access_token: data.access_token ?? "",
        expires_at:
          typeof data.expires_in === "number"
            ? Math.floor(Date.now() / 1000) + data.expires_in
            : undefined,
      },
    }
  },
} satisfies CredentialDefinition

export type GmailCredential = {
  access_token: string
  refresh_token?: string
  expires_at?: number
  client_id: string
  client_secret: string
}
