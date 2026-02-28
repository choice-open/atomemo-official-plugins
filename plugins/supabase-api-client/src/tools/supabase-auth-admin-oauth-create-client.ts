import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { parseJson } from "../lib/auth-result"

export const supabaseAuthAdminOAuthCreateClientTool: ToolDefinition = {
  name: "supabase-auth-admin-oauth-create-client",
  display_name: t("AUTH_ADMIN_OAUTH_CREATE_CLIENT_DISPLAY_NAME"),
  description: t("AUTH_ADMIN_OAUTH_CREATE_CLIENT_DESCRIPTION"),
  icon: "➕",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "client_name",
      type: "string",
      required: true,
      display_name: t("AUTH_ADMIN_OAUTH_CLIENT_NAME_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_ADMIN_OAUTH_CLIENT_NAME_PLACEHOLDER"),
        hint: t("AUTH_ADMIN_OAUTH_CLIENT_NAME_HINT"),
        width: "full",
      },
    },
    {
      name: "redirect_uris",
      type: "string",
      required: true,
      display_name: t("AUTH_ADMIN_OAUTH_REDIRECT_URIS_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_ADMIN_OAUTH_REDIRECT_URIS_PLACEHOLDER"),
        hint: t("AUTH_ADMIN_OAUTH_REDIRECT_URIS_HINT"),
        width: "full",
      },
    },
    {
      name: "client_uri",
      type: "string",
      required: false,
      display_name: t("AUTH_ADMIN_OAUTH_CLIENT_URI_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_ADMIN_OAUTH_CLIENT_URI_PLACEHOLDER"),
        hint: t("AUTH_ADMIN_OAUTH_CLIENT_URI_HINT"),
        width: "full",
      },
    },
    {
      name: "grant_types",
      type: "string",
      required: false,
      display_name: t("AUTH_ADMIN_OAUTH_GRANT_TYPES_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_ADMIN_OAUTH_GRANT_TYPES_PLACEHOLDER"),
        hint: t("AUTH_ADMIN_OAUTH_GRANT_TYPES_HINT"),
        width: "full",
      },
    },
    {
      name: "response_types",
      type: "string",
      required: false,
      display_name: t("AUTH_ADMIN_OAUTH_RESPONSE_TYPES_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_ADMIN_OAUTH_RESPONSE_TYPES_PLACEHOLDER"),
        hint: t("AUTH_ADMIN_OAUTH_RESPONSE_TYPES_HINT"),
        width: "full",
      },
    },
    {
      name: "scope",
      type: "string",
      required: false,
      display_name: t("AUTH_ADMIN_OAUTH_SCOPE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_ADMIN_OAUTH_SCOPE_PLACEHOLDER"),
        hint: t("AUTH_ADMIN_OAUTH_SCOPE_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const { credentials, parameters } = args
    const cred = credentials?.["supabase_credential"]
    if (!cred?.supabase_url || !cred?.supabase_key) {
      return {
        success: false,
        error: "Missing Supabase credential. Requires service_role key.",
        data: null,
        code: null,
      }
    }
    const clientName = (parameters.client_name as string)?.trim()
    if (!clientName) {
      return { success: false, error: "client_name is required.", data: null, code: null }
    }
    const redirectUrisRaw = (parameters.redirect_uris as string)?.trim()
    let redirectUris: string[]
    try {
      redirectUris = JSON.parse(redirectUrisRaw || "[]")
      if (!Array.isArray(redirectUris) || redirectUris.some((u) => typeof u !== "string")) {
        throw new Error("redirect_uris must be a JSON array of strings")
      }
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Invalid redirect_uris JSON.",
        data: null,
        code: null,
      }
    }
    const clientUri = (parameters.client_uri as string)?.trim() || undefined
    const grantTypes = parseJson<string[]>(parameters.grant_types as string, [])
    const responseTypes = parseJson<string[]>(parameters.response_types as string, [])
    const scope = (parameters.scope as string)?.trim() || undefined
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.admin.oauth.createClient({
      client_name: clientName,
      redirect_uris: redirectUris,
      client_uri: clientUri,
      grant_types: grantTypes.length ? (grantTypes as Parameters<typeof supabase.auth.admin.oauth.createClient>[0]["grant_types"]) : undefined,
      response_types: responseTypes.length ? (responseTypes as Parameters<typeof supabase.auth.admin.oauth.createClient>[0]["response_types"]) : undefined,
      scope,
    })
    if (result.error) {
      return {
        success: false,
        data: null,
        error: result.error.message,
        code: result.error.code ?? null,
      }
    }
    return { success: true, data: result.data, error: null, code: null }
  },
}
