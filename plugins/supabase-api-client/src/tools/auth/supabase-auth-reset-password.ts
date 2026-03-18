import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { authResult } from "../../lib/auth-result"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

export const supabaseAuthResetPasswordTool: ToolDefinition = {
  name: "supabase-auth-reset-password",
  display_name: t("AUTH_RESET_PASSWORD_DISPLAY_NAME"),
  description: t("AUTH_RESET_PASSWORD_DESCRIPTION"),
  icon: "🔑",
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
      name: "redirect_to",
      type: "string",
      required: false,
      display_name: t("AUTH_REDIRECT_TO_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_REDIRECT_TO_PLACEHOLDER"),
        hint: t("AUTH_REDIRECT_TO_HINT"),
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const { credentials, parameters } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)
    const email = String(parameters.email ?? "").trim()
    if (!email) {
      throw new Error("Email is required.")
    }
    const redirectTo = (parameters.redirect_to as string)?.trim() || undefined
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    return authResult(result) as ReturnType<
      ToolDefinition["invoke"]
    > extends Promise<infer R>
      ? R
      : never
  },
}
