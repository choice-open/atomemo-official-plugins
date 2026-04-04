import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"
import supabaseAuthGetClaimsSkill from "./supabase-auth-get-claims-skill.md" with { type: "text" }
export const supabaseAuthGetClaimsTool: ToolDefinition = {
  name: "supabase-auth-get-claims",
  display_name: t("AUTH_GET_CLAIMS_DISPLAY_NAME"),
  description: t("AUTH_GET_CLAIMS_DESCRIPTION"),
  skill: supabaseAuthGetClaimsSkill,
  icon: "🎫",
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
        sensitive: true,
        placeholder: t("AUTH_JWT_PLACEHOLDER"),
        hint: t("AUTH_GET_CLAIMS_JWT_HINT"),
        width: "full",
      },
    },
    {
      name: "allow_expired",
      type: "boolean",
      required: false,
      display_name: t("AUTH_GET_CLAIMS_ALLOW_EXPIRED_DISPLAY_NAME"),
      default: false,
      ui: {
        component: "switch",
        hint: t("AUTH_GET_CLAIMS_ALLOW_EXPIRED_HINT"),
      },
    },
  ],
  async invoke({ args }) {
    const { credentials, parameters } = args
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)
    const jwt = (parameters.jwt as string)?.trim() || undefined
    const allowExpired = Boolean(parameters.allow_expired)
    const result = await supabase.auth.getClaims(jwt, { allowExpired })
    if (result.error) {
      const e: any = new Error(result.error.message)
      e.code = result.error.code ?? null
      throw e
    }
    if (!result.data) {
      return { success: true, data: null, error: null, code: null }
    }
    const { claims, header } = result.data
    return {
      success: true,
      data: { claims, header },
      error: null,
      code: null,
    }
  },
}
