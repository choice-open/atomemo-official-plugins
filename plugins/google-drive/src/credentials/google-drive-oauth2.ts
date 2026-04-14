import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { hubFetch } from "../helpers/fetch"
import { t } from "../i18n/i18n-node"

const AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
const DEFAULT_SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

export const GOOGLE_DRIVE_O_AUTH2_CREDENTIAL_NAME = "Google_Drive_OAuth2"

export const googleDriveOAuth2Credential = {
  name: GOOGLE_DRIVE_O_AUTH2_CREDENTIAL_NAME,
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  oauth2: true,
  description: t("CREDENTIAL_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: t("CREDENTIAL_CLIENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CREDENTIAL_CLIENT_ID_HINT"),
        placeholder: t("CREDENTIAL_CLIENT_ID_PLACEHOLDER_OAUTH"),
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: t("CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        hint: t("CREDENTIAL_CLIENT_SECRET_HINT"),
        placeholder: t("CREDENTIAL_CLIENT_SECRET_PLACEHOLDER_OAUTH"),
      },
    },
    {
      name: "access_token",
      type: "encrypted_string",
    },
    {
      name: "refresh_token",
      type: "encrypted_string",
    },
    {
      name: "expires_at",
      type: "integer",
    },
  ],
  oauth2_build_authorize_url: async ({ args }) => {
    const credential = args.credential ?? {}
    const clientId = credential.client_id
    const { redirect_uri: redirectUri, state } = args

    if (
      typeof clientId !== "string" ||
      clientId.length === 0 ||
      typeof redirectUri !== "string" ||
      redirectUri.length === 0 ||
      typeof state !== "string" ||
      state.length === 0
    ) {
      throw new Error("client_id/redirect_uri/state is required")
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: DEFAULT_SCOPES.join(" "),
      state,
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
    })

    return {
      url: `${AUTHORIZATION_ENDPOINT}?${params.toString()}`,
    }
  },
  oauth2_get_token: async ({ args }) => {
    const credential = args.credential ?? {}
    const clientId = credential.client_id
    const clientSecret = credential.client_secret
    const { code, redirect_uri: redirectUri } = args

    if (
      typeof clientId !== "string" ||
      clientId.length === 0 ||
      typeof clientSecret !== "string" ||
      clientSecret.length === 0 ||
      typeof code !== "string" ||
      code.length === 0 ||
      typeof redirectUri !== "string" ||
      redirectUri.length === 0
    ) {
      throw new Error("client credentials/code/redirect_uri is required")
    }

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    })

    const response = await hubFetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })

    const data = (await response.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      error?: string
      error_description?: string
      [key: string]: unknown
    }

    if (!response.ok) {
      const codeValue =
        typeof data.error === "string" ? data.error : "request_failed"
      const message =
        typeof data.error_description === "string"
          ? data.error_description
          : "Failed to exchange authorization code for token"
      throw new Error(`${codeValue}: ${message}`)
    }

    if (
      typeof data.access_token !== "string" ||
      data.access_token.length === 0
    ) {
      throw new Error("access_token is missing in token response")
    }

    const parametersPatch: {
      access_token: string
      refresh_token: string
      expires_at?: number
      [key: string]: unknown
    } = {
      access_token: data.access_token,
      refresh_token: "",
    }

    if (
      typeof data.refresh_token === "string" &&
      data.refresh_token.length > 0
    ) {
      parametersPatch.refresh_token = data.refresh_token
    }

    if (typeof data.expires_in === "number") {
      parametersPatch.expires_at =
        Math.floor(Date.now() / 1000) + data.expires_in
    }

    return {
      parameters_patch: parametersPatch,
    }
  },
  oauth2_refresh_token: async ({ args }) => {
    const credential = args.credential ?? {}
    const clientId = credential.client_id
    const clientSecret = credential.client_secret
    const refreshToken = credential.refresh_token

    if (
      typeof clientId !== "string" ||
      clientId.length === 0 ||
      typeof clientSecret !== "string" ||
      clientSecret.length === 0 ||
      typeof refreshToken !== "string" ||
      refreshToken.length === 0
    ) {
      throw new Error("client credentials/refresh_token is required")
    }

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    })

    const response = await hubFetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })

    const data = (await response.json()) as {
      access_token?: string
      expires_in?: number
      error?: string
      error_description?: string
      [key: string]: unknown
    }

    if (!response.ok) {
      const codeValue =
        typeof data.error === "string" ? data.error : "request_failed"
      const message =
        typeof data.error_description === "string"
          ? data.error_description
          : "Failed to refresh access token"
      throw new Error(`${codeValue}: ${message}`)
    }

    if (
      typeof data.access_token !== "string" ||
      data.access_token.length === 0
    ) {
      throw new Error("access_token is missing in refresh response")
    }

    const parametersPatch: {
      access_token: string
      expires_at?: number
      [key: string]: unknown
    } = {
      access_token: data.access_token,
    }

    if (typeof data.expires_in === "number") {
      parametersPatch.expires_at =
        Math.floor(Date.now() / 1000) + data.expires_in
    }

    return {
      parameters_patch: parametersPatch,
    }
  },
} satisfies CredentialDefinition
