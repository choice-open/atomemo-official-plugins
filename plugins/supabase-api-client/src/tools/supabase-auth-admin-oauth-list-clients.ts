import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"

export const supabaseAuthAdminOAuthListClientsTool: ToolDefinition = {
  name: "supabase-auth-admin-oauth-list-clients",
  display_name: t("AUTH_ADMIN_OAUTH_LIST_CLIENTS_DISPLAY_NAME"),
  description: t("AUTH_ADMIN_OAUTH_LIST_CLIENTS_DESCRIPTION"),
  icon: "📋",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "page",
      type: "integer",
      required: false,
      display_name: t("AUTH_ADMIN_OAUTH_PAGE_DISPLAY_NAME"),
      default: 1,
      minimum: 1,
      ui: { component: "number-input", width: "small" },
    },
    {
      name: "per_page",
      type: "integer",
      required: false,
      display_name: t("AUTH_ADMIN_OAUTH_PER_PAGE_DISPLAY_NAME"),
      default: 50,
      minimum: 1,
      maximum: 1000,
      ui: { component: "number-input", width: "small" },
    },
  ],
  async invoke({ args }) {
    const { credentials, parameters } = args
    const cred = credentials?.["supabase_credential"]
    if (!cred?.supabase_url || !cred?.supabase_key) {
      return {
        success: false,
        error: "Missing Supabase credential (supabase_url or supabase_key). Requires service_role key.",
        data: null,
        code: null,
      }
    }
    const page = Number(parameters.page) || 1
    const perPage = Number(parameters.per_page) || 50
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.admin.oauth.listClients({ page, perPage })
    if (result.error) {
      return {
        success: false,
        data: null,
        error: result.error.message,
        code: result.error.code ?? null,
      }
    }
    return {
      success: true,
      data: result.data,
      error: null,
      code: null,
    }
  },
}
