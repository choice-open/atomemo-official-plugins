import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult } from "../lib/auth-result"

const OTP_TYPES = ["email", "sms", "phone_change", "email_change", "magiclink", "recovery"] as const

export const supabaseAuthVerifyOtpTool: ToolDefinition = {
  name: "supabase-auth-verify-otp",
  display_name: t("AUTH_VERIFY_OTP_DISPLAY_NAME"),
  description: t("AUTH_VERIFY_OTP_DESCRIPTION"),
  icon: "✉️",
  parameters: [
    {
      name: "supabase_credential",
      type: "credential_id",
      required: true,
      display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
      credential_name: "supabase-connection",
    },
    {
      name: "type",
      type: "string",
      required: true,
      display_name: t("AUTH_OTP_TYPE_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: [
          { value: "email", label: t("AUTH_OTP_TYPE_EMAIL") },
          { value: "sms", label: t("AUTH_OTP_TYPE_SMS") },
          { value: "phone_change", label: t("AUTH_OTP_TYPE_PHONE_CHANGE") },
          { value: "email_change", label: t("AUTH_OTP_TYPE_EMAIL_CHANGE") },
          { value: "magiclink", label: t("AUTH_OTP_TYPE_MAGICLINK") },
          { value: "recovery", label: t("AUTH_OTP_TYPE_RECOVERY") },
        ],
        hint: t("AUTH_OTP_TYPE_HINT"),
        width: "medium",
      },
    },
    {
      name: "token_hash",
      type: "string",
      required: false,
      display_name: t("AUTH_OTP_TOKEN_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_OTP_TOKEN_ID_PLACEHOLDER"),
        hint: t("AUTH_OTP_TOKEN_ID_HINT"),
        width: "full",
      },
    },
    {
      name: "token",
      type: "string",
      required: false,
      display_name: t("AUTH_OTP_CODE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_OTP_CODE_PLACEHOLDER"),
        hint: t("AUTH_OTP_CODE_HINT"),
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
    const type = (parameters.type as string)?.trim()
    if (!type || !OTP_TYPES.includes(type as (typeof OTP_TYPES)[number])) {
      return {
        success: false,
        error: `type must be one of: ${OTP_TYPES.join(", ")}`,
        data: null,
        code: null,
      }
    }
    const tokenHash = (parameters.token_hash as string)?.trim()
    const token = (parameters.token as string)?.trim()
    if (!tokenHash && !token) {
      return {
        success: false,
        error: "Either token_hash or token is required.",
        data: null,
        code: null,
      }
    }
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const params = tokenHash
      ? { type, token_hash: tokenHash }
      : { type, token }
    const result = await supabase.auth.verifyOtp(
      params as Parameters<typeof supabase.auth.verifyOtp>[0]
    )
    return authResult(result) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
