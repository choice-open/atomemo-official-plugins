import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { authResult } from "../../lib/auth-result"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseAuthGetSessionSkill from "./supabase-auth-get-session-skill.md" with { type: "text" }

export const supabaseAuthGetSessionTool: ToolDefinition = {
  name: "supabase-auth-get-session",
  display_name: t("AUTH_GET_SESSION_DISPLAY_NAME"),
  description: t("AUTH_GET_SESSION_DESCRIPTION"),
  skill: supabaseAuthGetSessionSkill,
  icon: "📋",
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
    const { credentials, parameters } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)
    const result = await supabase.auth.getSession()
    return authResult({ data: result.data, error: result.error }) as ReturnType<
      ToolDefinition["invoke"]
    > extends Promise<infer R>
      ? R
      : never
  },
}
