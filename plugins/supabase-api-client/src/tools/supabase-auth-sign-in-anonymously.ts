import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult } from "../lib/auth-result"

export const supabaseAuthSignInAnonymouslyTool: ToolDefinition = {
  name: "supabase-auth-sign-in-anonymously",
  display_name: t("AUTH_SIGN_IN_ANONYMOUSLY_DISPLAY_NAME"),
  description: t("AUTH_SIGN_IN_ANONYMOUSLY_DESCRIPTION"),
  icon: "🎭",
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
    const result = await supabase.auth.signInAnonymously()
    return authResult(result) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
