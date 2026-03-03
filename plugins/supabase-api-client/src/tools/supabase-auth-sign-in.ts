import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { getSupabaseClientFromArgs } from "../lib/get-supabase-client"
import { t } from "../i18n/i18n-node"
import { authResult } from "../lib/auth-result"

export const supabaseAuthSignInTool: ToolDefinition = {
  name: "supabase-auth-sign-in",
  display_name: t("AUTH_SIGN_IN_DISPLAY_NAME"),
  description: t("AUTH_SIGN_IN_DESCRIPTION"),
  icon: "🔐",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "email",
      type: "string",
      required: true,
      display_name: t("AUTH_EMAIL_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_EMAIL_PLACEHOLDER"),
        hint: t("AUTH_EMAIL_HINT"),
        width: "full",
      },
    },
    {
      name: "password",
      type: "string",
      required: true,
      display_name: t("AUTH_PASSWORD_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,
        placeholder: t("AUTH_PASSWORD_PLACEHOLDER"),
        hint: t("AUTH_PASSWORD_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const { credentials, parameters } = args
    const clientResult = getSupabaseClientFromArgs(parameters, credentials)
    if (clientResult.error) return clientResult.error

    const supabase = clientResult.supabase
    const email = String(parameters.email ?? "").trim()
    const password = String(parameters.password ?? "")
    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required.",
        data: null,
        code: null,
      }
    }
    const result = await supabase.auth.signInWithPassword({ email, password })
    return authResult({ data: result.data, error: result.error }) as ReturnType<
      ToolDefinition["invoke"]
    > extends Promise<infer R>
      ? R
      : never
  },
}
