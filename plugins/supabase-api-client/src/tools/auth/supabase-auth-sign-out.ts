import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

export const supabaseAuthSignOutTool: ToolDefinition = {
  name: "supabase-auth-sign-out",
  display_name: t("AUTH_SIGN_OUT_DISPLAY_NAME"),
  description: t("AUTH_SIGN_OUT_DESCRIPTION"),
  icon: "🚪",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "scope",
      type: "string",
      required: false,
      display_name: t("AUTH_SIGN_OUT_SCOPE_DISPLAY_NAME"),
      default: "local",
      ui: {
        component: "select",
        options: [
          { value: "local", label: t("AUTH_SCOPE_LOCAL") },
          { value: "global", label: t("AUTH_SCOPE_GLOBAL") },
        ],
        hint: t("AUTH_SIGN_OUT_SCOPE_HINT"),
        width: "medium",
      },
    },
  ],
  async invoke({ args }) {
    const { credentials, parameters } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)
    const scope = (parameters.scope as string) === "global" ? "global" : "local"
    const { error } = await supabase.auth.signOut({ scope })
    if (error) {
      const e: any = new Error(error.message)
      e.code = error.code ?? null
      throw e
    }
    return { success: true, data: null, error: null, code: null }
  },
}
