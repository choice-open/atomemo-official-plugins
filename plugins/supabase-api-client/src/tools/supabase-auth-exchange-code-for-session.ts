import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult } from "../lib/auth-result"

export const supabaseAuthExchangeCodeForSessionTool: ToolDefinition = {
  name: "supabase-auth-exchange-code-for-session",
  display_name: t("AUTH_EXCHANGE_CODE_DISPLAY_NAME"),
  description: t("AUTH_EXCHANGE_CODE_DESCRIPTION"),
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
      name: "code",
      type: "string",
      required: true,
      display_name: t("AUTH_CODE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_CODE_PLACEHOLDER"),
        hint: t("AUTH_CODE_HINT"),
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
        error: "Missing Supabase credential (supabase_url or supabase_key).",
        data: null,
        code: null,
      }
    }
    const code = (parameters.code as string)?.trim()
    if (!code) {
      return {
        success: false,
        error: "code is required.",
        data: null,
        code: null,
      }
    }
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.exchangeCodeForSession(code)
    return authResult({ data: result.data, error: result.error }) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
