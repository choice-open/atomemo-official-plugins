import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"

export const supabaseAuthAdminOAuthRegenerateSecretTool: ToolDefinition = {
  name: "supabase-auth-admin-oauth-regenerate-secret",
  display_name: t("AUTH_ADMIN_OAUTH_REGENERATE_SECRET_DISPLAY_NAME"),
  description: t("AUTH_ADMIN_OAUTH_REGENERATE_SECRET_DESCRIPTION"),
  icon: "🔄",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: t("AUTH_ADMIN_OAUTH_CLIENT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_ADMIN_OAUTH_CLIENT_ID_PLACEHOLDER"),
        hint: t("AUTH_ADMIN_OAUTH_CLIENT_ID_HINT"),
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
    const clientId = (parameters.client_id as string)?.trim()
    if (!clientId) {
      return { success: false, error: "client_id is required.", data: null, code: null }
    }
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.admin.oauth.regenerateClientSecret(clientId)
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
