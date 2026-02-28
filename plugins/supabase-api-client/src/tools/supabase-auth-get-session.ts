import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult } from "../lib/auth-result"

export const supabaseAuthGetSessionTool: ToolDefinition = {
  name: "supabase-auth-get-session",
  display_name: t("AUTH_GET_SESSION_DISPLAY_NAME"),
  description: t("AUTH_GET_SESSION_DESCRIPTION"),
  icon: "📋",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
  ],
  async invoke({ args }) {
    const { credentials } = args
    const cred = credentials?.["supabase_credential"]
    if (!cred?.supabase_url || !cred?.supabase_key) {
      return {
        success: false,
        error: "Missing Supabase credential (supabase_url or supabase_key).",
        data: null,
        code: null,
      }
    }
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.getSession()
    return authResult({ data: result.data, error: result.error }) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
