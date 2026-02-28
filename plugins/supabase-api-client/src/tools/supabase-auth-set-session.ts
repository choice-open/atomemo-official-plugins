import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult } from "../lib/auth-result"

export const supabaseAuthSetSessionTool: ToolDefinition = {
  name: "supabase-auth-set-session",
  display_name: t("AUTH_SET_SESSION_DISPLAY_NAME"),
  description: t("AUTH_SET_SESSION_DESCRIPTION"),
  icon: "🔗",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "access_token",
      type: "string",
      required: true,
      display_name: t("AUTH_ACCESS_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,
        placeholder: t("AUTH_ACCESS_TOKEN_PLACEHOLDER"),
        hint: t("AUTH_ACCESS_TOKEN_HINT"),
        width: "full",
      },
    },
    {
      name: "refresh_token",
      type: "string",
      required: true,
      display_name: t("AUTH_REFRESH_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,
        placeholder: t("AUTH_REFRESH_TOKEN_PLACEHOLDER"),
        hint: t("AUTH_REFRESH_TOKEN_HINT"),
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
    const accessToken = (parameters.access_token as string)?.trim()
    const refreshToken = (parameters.refresh_token as string)?.trim()
    if (!accessToken || !refreshToken) {
      return {
        success: false,
        error: "access_token and refresh_token are required.",
        data: null,
        code: null,
      }
    }
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    return authResult(result) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
