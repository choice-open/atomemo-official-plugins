import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const SCOPE = "https://www.googleapis.com/auth/tasks"

export const googleTasksOAuth2Credential = {
  name: "google-tasks-oauth2",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  description: t("CREDENTIAL_DESCRIPTION"),
  icon: "link:google-tasks",

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
        width: "full",
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: t("CLIENT_SECRET_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        placeholder: t("CLIENT_SECRET_PLACEHOLDER"),
        width: "full",
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
      scope: SCOPE,
      access_type: "offline",
      prompt: "consent",
    })

    return { url: `${GOOGLE_AUTH_URL}?${params.toString()}` }
  },

  async oauth2_get_token({ args }) {
    const { client_id, client_secret } = args.credential
    const { code, redirect_uri } = args

    const response = await fetch(GOOGLE_TOKEN_URL, {
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

    const data = (await response.json()) as Record<string, any>

    if (!response.ok) {
      throw new Error(`Failed to get token: ${data.error_description || data.error}`)
    }

    return {
      parameters_patch: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      },
    }
  },

  async oauth2_refresh_token({ args }) {
    const { client_id, client_secret, refresh_token } = args.credential

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: client_id as string,
        client_secret: client_secret as string,
        refresh_token: refresh_token as string,
        grant_type: "refresh_token",
      }),
    })

    const data = (await response.json()) as Record<string, any>

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${data.error_description || data.error}`)
    }

    return {
      parameters_patch: {
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      },
    }
  },
} satisfies CredentialDefinition
