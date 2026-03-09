import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { authResult } from "../../lib/auth-result"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

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
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const supabase = clientResult.supabase
    const code = (parameters.code as string)?.trim()
    if (!code) {
      return {
        success: false,
        error: "code is required.",
        data: null,
        code: null,
      }
    }
    const result = await supabase.auth.exchangeCodeForSession(code)
    return authResult({ data: result.data, error: result.error }) as ReturnType<
      ToolDefinition["invoke"]
    > extends Promise<infer R>
      ? R
      : never
  },
}
