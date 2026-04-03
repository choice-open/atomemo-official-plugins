import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { authResult } from "../../lib/auth-result"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseAuthSignInAnonymouslySkill from "./supabase-auth-sign-in-anonymously-skill.md" with { type: "text" }

export const supabaseAuthSignInAnonymouslyTool: ToolDefinition = {
  name: "supabase-auth-sign-in-anonymously",
  display_name: t("AUTH_SIGN_IN_ANONYMOUSLY_DISPLAY_NAME"),
  description: t("AUTH_SIGN_IN_ANONYMOUSLY_DESCRIPTION"),
  skill: supabaseAuthSignInAnonymouslySkill,
  icon: "🎭",
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
    const result = await supabase.auth.signInAnonymously()
    return authResult(result) as ReturnType<
      ToolDefinition["invoke"]
    > extends Promise<infer R>
      ? R
      : never
  },
}
