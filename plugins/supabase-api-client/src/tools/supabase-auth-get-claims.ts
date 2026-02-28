import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
export const supabaseAuthGetClaimsTool: ToolDefinition = {
  name: "supabase-auth-get-claims",
  display_name: t("AUTH_GET_CLAIMS_DISPLAY_NAME"),
  description: t("AUTH_GET_CLAIMS_DESCRIPTION"),
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
      ui: { component: "switch", hint: t("AUTH_GET_CLAIMS_ALLOW_EXPIRED_HINT") },
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
    const allowExpired = Boolean(parameters.allow_expired)
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.getClaims(jwt, { allowExpired })
    if (result.error) {
      return {
        success: false,
        data: null,
        error: result.error.message,
        code: result.error.code ?? null,
      }
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
