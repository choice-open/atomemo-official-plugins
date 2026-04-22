import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const HUBSPOT_TOKEN_ENDPOINT = "https://api.hubapi.com/oauth/v3/token"

const HUBSPOT_REQUIRED_SCOPES = [
  "automation",
  "communication_preferences.read_write",
  "content",
  "crm.lists.read",
  "crm.lists.write",
  // `hubspot-create-engagement` supports meetings, which map to appointments scopes.
  "crm.objects.appointments.write",
  "crm.objects.companies.read",
  "crm.objects.companies.write",
  "crm.objects.contacts.read",
  "crm.objects.contacts.write",
  "crm.objects.custom.read",
  "crm.objects.custom.write",
  "crm.objects.deals.read",
  "crm.objects.deals.write",
  "crm.objects.line_items.read",
  "crm.objects.line_items.write",
  "crm.objects.owners.read",
  "crm.objects.products.read",
  "crm.objects.products.write",
  "crm.schemas.appointments.read",
  "crm.schemas.companies.read",
  "crm.schemas.contacts.read",
  "crm.schemas.custom.read",
  "crm.schemas.deals.read",
  "crm.schemas.line_items.read",
  "files",
  "forms",
  "tickets",
]

// analytics.behavioral_events.send
// social

const HUBSPOT_REQUIRED_SCOPES_QUERY = HUBSPOT_REQUIRED_SCOPES.join(" ")

type HubSpotOAuthTokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  error?: string
  error_description?: string
  message?: string
}

function getOAuthErrorMessage(
  payload: HubSpotOAuthTokenResponse,
  fallback: string,
): string {
  return payload.error_description ?? payload.message ?? payload.error ?? fallback
}

export const hubspotOAuth2Credential = {
  name: "hubspot-oauth2",
  display_name: t("CREDENTIAL_OAUTH2_DISPLAY_NAME"),
  description: t("CREDENTIAL_OAUTH2_DESCRIPTION"),
  icon: "🔐",
  oauth2: true,
  oauth2_grant_type: "authorization_code",

  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: t("CREDENTIAL_OAUTH2_CLIENT_ID_LABEL"),
      ui: {
        component: "input",
        placeholder: t("CREDENTIAL_OAUTH2_CLIENT_ID_PLACEHOLDER"),
        hint: t("CREDENTIAL_OAUTH2_CLIENT_ID_HINT"),
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: t("CREDENTIAL_OAUTH2_CLIENT_SECRET_LABEL"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("CREDENTIAL_OAUTH2_CLIENT_SECRET_HINT"),
      },
    },
    {
      // Display-only field to show the full scope inventory for this credential.
      name: "scopes",
      type: "string",
      required: false,
      display_name: t("CREDENTIAL_OAUTH2_SCOPES_LABEL"),
      constant: [
        ...HUBSPOT_REQUIRED_SCOPES,
      ].join("\n"),
      ui: {
        component: "textarea",
        readonly: true,
        hint: t("CREDENTIAL_OAUTH2_SCOPES_HINT"),
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

  async oauth2_build_authorize_url({ args }) {
    const { client_id } = args.credential
    const { redirect_uri, state } = args
    const params = new URLSearchParams({
      client_id: String(client_id),
      redirect_uri,
      state,
      response_type: "code",
      scope: HUBSPOT_REQUIRED_SCOPES_QUERY,
    })
    return {
      url: `https://app.hubspot.com/oauth/authorize?${params.toString()}`,
    }
  },

  async oauth2_get_token({ args }) {
    const { client_id, client_secret } = args.credential
    const { code, redirect_uri } = args
    const response = await fetch(HUBSPOT_TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: String(client_id),
        client_secret: String(client_secret),
        code,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    })
    const payload = (await response.json()) as HubSpotOAuthTokenResponse
    if (!response.ok) {
      throw new Error(
        getOAuthErrorMessage(
          payload,
          `OAuth2 token exchange failed: ${response.status}`,
        ),
      )
    }
    if (!payload.access_token) {
      throw new Error("OAuth2 token exchange failed: access_token is missing")
    }
    if (!payload.refresh_token) {
      throw new Error("OAuth2 token exchange failed: refresh_token is missing")
    }
    return {
      parameters_patch: {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + (payload.expires_in ?? 3600),
      },
    }
  },

  async oauth2_refresh_token({ args }) {
    const { client_id, client_secret, refresh_token } = args.credential
    const redirect_uri = (args as { redirect_uri?: string }).redirect_uri
    const response = await fetch(HUBSPOT_TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: String(client_id),
        client_secret: String(client_secret),
        refresh_token: String(refresh_token),
        grant_type: "refresh_token",
        ...(redirect_uri ? { redirect_uri } : {}),
      }),
    })
    const payload = (await response.json()) as HubSpotOAuthTokenResponse
    if (!response.ok) {
      throw new Error(
        getOAuthErrorMessage(
          payload,
          `OAuth2 token refresh failed: ${response.status}`,
        ),
      )
    }
    if (!payload.access_token) {
      throw new Error("OAuth2 token refresh failed: access_token is missing")
    }
    return {
      parameters_patch: {
        access_token: payload.access_token,
        ...(payload.refresh_token
          ? { refresh_token: payload.refresh_token }
          : { refresh_token: String(refresh_token) }),
        expires_at:
          Math.floor(Date.now() / 1000) + (payload.expires_in ?? 3600),
      },
    }
  },
} satisfies CredentialDefinition
