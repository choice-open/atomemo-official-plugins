import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult, parseJson } from "../lib/auth-result"

export const supabaseAuthSignUpTool: ToolDefinition = {
  name: "supabase-auth-sign-up",
  display_name: t("AUTH_SIGN_UP_DISPLAY_NAME"),
  description: t("AUTH_SIGN_UP_DESCRIPTION"),
  icon: "📝",
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
    {
      name: "options",
      type: "string",
      required: false,
      display_name: t("AUTH_SIGN_UP_OPTIONS_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_SIGN_UP_OPTIONS_PLACEHOLDER"),
        hint: t("AUTH_SIGN_UP_OPTIONS_HINT"),
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
    const options = parseJson<{ emailRedirectTo?: string; data?: Record<string, unknown> }>(
      parameters.options as string,
      {}
    )
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.signUp({ email, password, options })
    return authResult(result) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
