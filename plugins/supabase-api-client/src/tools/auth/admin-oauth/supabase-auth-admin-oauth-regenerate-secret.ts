import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../../lib/get-supabase-client"

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
    const { supabase } = getSupabaseClientFromArgs(
      parameters,
      credentials,
      undefined,
      {
        useServiceRoleKey: true,
      },
    )
    const clientId = (parameters.client_id as string)?.trim()
    if (!clientId) {
      throw new Error("client_id is required.")
    }
    const result =
      await supabase.auth.admin.oauth.regenerateClientSecret(clientId)
    if (result.error) {
      const e: any = new Error(result.error.message)
      e.code = result.error.code ?? null
      throw e
    }
    return { success: true, data: result.data, error: null, code: null }
  },
}
