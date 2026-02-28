import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult, parseJson } from "../lib/auth-result"

export const supabaseAuthUpdateUserTool: ToolDefinition = {
  name: "supabase-auth-update-user",
  display_name: t("AUTH_UPDATE_USER_DISPLAY_NAME"),
  description: t("AUTH_UPDATE_USER_DESCRIPTION"),
  icon: "✏️",
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
        hint: t("AUTH_UPDATE_USER_ACCESS_TOKEN_HINT"),
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
    {
      name: "attributes",
      type: "string",
      required: true,
      display_name: t("AUTH_UPDATE_USER_ATTRIBUTES_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_UPDATE_USER_ATTRIBUTES_PLACEHOLDER"),
        hint: t("AUTH_UPDATE_USER_ATTRIBUTES_HINT"),
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
    const attributes = parseJson<{ email?: string; password?: string; data?: Record<string, unknown> }>(
      parameters.attributes as string,
      {}
    )
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
    const result = await supabase.auth.updateUser(attributes)
    return authResult({ data: result.data, error: result.error }) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
