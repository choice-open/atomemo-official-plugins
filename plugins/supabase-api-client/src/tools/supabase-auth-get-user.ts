import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult } from "../lib/auth-result"

export const supabaseAuthGetUserTool: ToolDefinition = {
  name: "supabase-auth-get-user",
  display_name: t("AUTH_GET_USER_DISPLAY_NAME"),
  description: t("AUTH_GET_USER_DESCRIPTION"),
  icon: "👤",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "jwt",
      type: "string",
      required: false,
      display_name: t("AUTH_JWT_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_JWT_PLACEHOLDER"),
        hint: t("AUTH_JWT_HINT"),
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
    const jwt = (parameters.jwt as string)?.trim() || undefined
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.getUser(jwt)
    return authResult({ data: result.data, error: result.error }) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
