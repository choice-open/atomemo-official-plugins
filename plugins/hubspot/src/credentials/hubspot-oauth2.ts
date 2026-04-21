import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const HUBSPOT_SCOPES = [
  "crm.objects.contacts.read",
  "crm.objects.contacts.write",
  "crm.objects.companies.read",
  "crm.objects.companies.write",
  "crm.objects.deals.read",
  "crm.objects.deals.write",
  "crm.objects.owners.read",
  "crm.schemas.contacts.read",
  "crm.schemas.companies.read",
  "crm.schemas.deals.read",
  "crm.lists.read",
  "crm.lists.write",
  "tickets",
  "forms",
  "content",
  "files",
  "automation",
  "e-commerce",
  "communication_preferences.read_write",
].join(" ")

export const hubspotOAuth2Credential = {
  name: "hubspot-oauth2",
  display_name: t("CREDENTIAL_OAUTH2_DISPLAY_NAME"),
  description: t("CREDENTIAL_OAUTH2_DESCRIPTION"),
  icon: "🔐",
  oauth2: true,

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
      scope: HUBSPOT_SCOPES,
    })
    return {
      url: `https://app.hubspot.com/oauth/authorize?${params.toString()}`,
    }
  },

  async oauth2_get_token({ args }) {
    const { client_id, client_secret } = args.credential
    const { code, redirect_uri } = args
    const response = await fetch("https://api.hubapi.com/oauth/v1/token", {
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
    const payload = (await response.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      message?: string
    }
    if (!response.ok) {
      throw new Error(
        payload.message ?? `OAuth2 token exchange failed: ${response.status}`,
      )
    }
    return {
      parameters_patch: {
        access_token: payload.access_token!,
        refresh_token: payload.refresh_token!,
        expires_at:
          Math.floor(Date.now() / 1000) + (payload.expires_in ?? 3600),
      },
    }
  },

  async oauth2_refresh_token({ args }) {
    const { client_id, client_secret, refresh_token } = args.credential
    const response = await fetch("https://api.hubapi.com/oauth/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: String(client_id),
        client_secret: String(client_secret),
        refresh_token: String(refresh_token),
        grant_type: "refresh_token",
      }),
    })
    const payload = (await response.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      message?: string
    }
    if (!response.ok) {
      throw new Error(
        payload.message ?? `OAuth2 token refresh failed: ${response.status}`,
      )
    }
    return {
      parameters_patch: {
        access_token: payload.access_token!,
        ...(payload.refresh_token
          ? { refresh_token: payload.refresh_token }
          : {}),
        expires_at:
          Math.floor(Date.now() / 1000) + (payload.expires_in ?? 3600),
      },
    }
  },
} satisfies CredentialDefinition
