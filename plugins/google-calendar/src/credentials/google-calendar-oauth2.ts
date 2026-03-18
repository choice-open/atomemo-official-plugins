import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar"

export const googleCalendarOAuth2Credential = {
  name: "google-calendar-oauth2",
  display_name: t("GOOGLE_CALENDAR_CREDENTIAL_DISPLAY_NAME"),
  description: t("GOOGLE_CALENDAR_CREDENTIAL_DESCRIPTION"),
  icon: "📅",

  oauth2: true,

  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: t("CLIENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("CLIENT_ID_PLACEHOLDER"),
        hint: t("CLIENT_ID_HINT"),
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: t("CLIENT_SECRET_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        hint: t("CLIENT_SECRET_HINT"),
      },
    },
    { name: "access_token", type: "encrypted_string" },
    { name: "refresh_token", type: "encrypted_string" },
    { name: "expires_at", type: "integer" },
  ],

  async oauth2_build_authorize_url({ args }) {
    const { client_id } = args.credential
    const { redirect_uri, state } = args

    const params = new URLSearchParams({
      client_id: client_id as string,
      redirect_uri,
      state,
      response_type: "code",
      scope: CALENDAR_SCOPE,
      access_type: "offline",
      prompt: "consent",
    })

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    }
  },

  async oauth2_get_token({ args }) {
    const { client_id, client_secret } = args.credential
    const { code, redirect_uri } = args

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: client_id as string,
        client_secret: client_secret as string,
        code,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        `获取 Token 失败: ${(data as { error_description?: string }).error_description ?? (data as { error?: string }).error ?? String(response.status)}`
      )
    }

    const payload = data as {
      access_token: string
      refresh_token?: string
      expires_in: number
    }

    const refreshToken =
      payload.refresh_token ?? (args.credential.refresh_token as string | undefined)
    if (!refreshToken) {
      throw new Error(
        "Refresh token 未返回，请确保授权时使用 access_type=offline 和 prompt=consent"
      )
    }

    return {
      parameters_patch: {
        access_token: payload.access_token,
        refresh_token: refreshToken,
        expires_at: Math.floor(Date.now() / 1000) + payload.expires_in,
      },
    }
  },

  async oauth2_refresh_token({ args }) {
    const { client_id, client_secret, refresh_token } = args.credential

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: client_id as string,
        client_secret: client_secret as string,
        refresh_token: refresh_token as string,
        grant_type: "refresh_token",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        `刷新 Token 失败: ${(data as { error_description?: string }).error_description ?? (data as { error?: string }).error ?? String(response.status)}`
      )
    }

    const payload = data as { access_token: string; expires_in: number }

    return {
      parameters_patch: {
        access_token: payload.access_token,
        expires_at: Math.floor(Date.now() / 1000) + payload.expires_in,
      },
    }
  }
} satisfies CredentialDefinition
