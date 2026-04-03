import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  OAuth2,
  generateCodeChallenge,
  generateCodeVerifier,
} from "@xdevplatform/xdk"
import { t } from "../i18n/i18n-node"

const TWITTER_OAUTH_SCOPES = [
  "tweet.read",
  "tweet.write",
  "users.read",
  "follows.read",
  "like.read",
  "like.write",
  "offline.access",
]

// Store code verifier in memory between oauth2_build_authorize_url and oauth2_get_token
// since the SDK schema strips parameters_patch from the authorize url response.
let pendingCodeVerifier: string | null = null

export const twitterOAuthCredential = {
  name: "twitter-oauth",
  display_name: t("TWITTER_CREDENTIAL_DISPLAY_NAME"),
  description: t("TWITTER_CREDENTIAL_DESCRIPTION"),
  icon: "🐦",
  oauth2: true,
  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: t("TWITTER_CREDENTIAL_CLIENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TWITTER_CREDENTIAL_CLIENT_ID_HINT"),
        width: "full",
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: t("TWITTER_CREDENTIAL_CLIENT_SECRET_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("TWITTER_CREDENTIAL_CLIENT_SECRET_HINT"),
        width: "full",
      },
    },
    {
      name: "access_token",
      type: "encrypted_string",
      required: false,
      display_name: t("TWITTER_CREDENTIAL_ACCESS_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        display_none: true,
      },
    },
    {
      name: "refresh_token",
      type: "encrypted_string",
      required: false,
      display_name: t("TWITTER_CREDENTIAL_REFRESH_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        display_none: true,
      },
    },
    {
      name: "expires_at",
      type: "integer",
      required: false,
      display_name: t("TWITTER_CREDENTIAL_EXPIRES_AT_DISPLAY_NAME"),
      ui: { component: "number-input", display_none: true },
    },
  ],

  async oauth2_build_authorize_url({ args }) {
    const { client_id, client_secret } = args.credential as {
      client_id?: string
      client_secret?: string
    }
    const { redirect_uri, state } = args
    if (!client_id) throw new Error("client_id is required.")
    if (!client_secret) throw new Error("client_secret is required.")

    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    // Store in memory for oauth2_get_token to use
    pendingCodeVerifier = codeVerifier

    const oauth2 = new OAuth2({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: redirect_uri,
      scope: TWITTER_OAUTH_SCOPES,
    })

    oauth2.setPkceParameters(codeVerifier, codeChallenge)

    const url = await oauth2.getAuthorizationUrl(state)

    return { url }
  },

  async oauth2_get_token({ args }) {
    const { client_id, client_secret } = args.credential as {
      client_id?: string
      client_secret?: string
    }
    const { code, redirect_uri } = args
    if (!client_id) throw new Error("client_id is required.")
    if (!client_secret) throw new Error("client_secret is required.")
    if (!pendingCodeVerifier)
      throw new Error(
        "code_verifier is missing. Please re-initiate the OAuth flow.",
      )

    const codeVerifier = pendingCodeVerifier
    pendingCodeVerifier = null

    const oauth2 = new OAuth2({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: redirect_uri,
      scope: TWITTER_OAUTH_SCOPES,
    })

    const tokens = await oauth2.exchangeCode(code, codeVerifier)

    return {
      parameters_patch: {
        access_token: tokens.access_token ?? "",
        refresh_token: tokens.refresh_token ?? "",
        expires_at: tokens.expires_at ?? undefined,
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

    const oauth2 = new OAuth2({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: "",
      scope: TWITTER_OAUTH_SCOPES,
    })

    const tokens = await oauth2.refreshAccessToken(refresh_token)

    return {
      parameters_patch: {
        access_token: tokens.access_token ?? "",
        refresh_token: tokens.refresh_token ?? refresh_token ?? "",
        expires_at:
          typeof tokens.expires_in === "number"
            ? Math.floor(Date.now() / 1000) + tokens.expires_in
            : undefined,
      },
    }
  },
} satisfies CredentialDefinition

export type TwitterCredential = {
  access_token: string
  refresh_token?: string
  expires_at?: number
  client_id: string
  client_secret: string
}
