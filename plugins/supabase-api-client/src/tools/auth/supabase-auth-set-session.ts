import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { authResult } from "../../lib/auth-result"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseAuthSetSessionSkill from "./supabase-auth-set-session-skill.md" with { type: "text" }

export const supabaseAuthSetSessionTool: ToolDefinition = {
  name: "supabase-auth-set-session",
  display_name: t("AUTH_SET_SESSION_DISPLAY_NAME"),
  description: t("AUTH_SET_SESSION_DESCRIPTION"),
  skill: supabaseAuthSetSessionSkill,
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
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)
    const accessToken = (parameters.access_token as string)?.trim()
    const refreshToken = (parameters.refresh_token as string)?.trim()
    if (!accessToken || !refreshToken) {
      throw new Error("access_token and refresh_token are required.")
    }
    const result = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    return authResult(result) as ReturnType<
      ToolDefinition["invoke"]
    > extends Promise<infer R>
      ? R
      : never
  },
}
