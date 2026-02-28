import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"

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
    const cred = credentials?.["supabase_credential"]
    if (!cred?.supabase_url || !cred?.supabase_key) {
      return {
        success: false,
        error: "Missing Supabase credential (supabase_url or supabase_key).",
        data: null,
        code: null,
      }
    }
    const scope = (parameters.scope as string) === "global" ? "global" : "local"
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const { error } = await supabase.auth.signOut({ scope })
    if (error) {
      return { success: false, data: null, error: error.message, code: error.code ?? null }
    }
    return { success: true, data: null, error: null, code: null }
  },
}
