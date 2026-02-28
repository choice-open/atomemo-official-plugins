import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult } from "../lib/auth-result"

const RESEND_TYPES = ["signup", "email_change", "sms", "phone_change"] as const

export const supabaseAuthResendOtpTool: ToolDefinition = {
  name: "supabase-auth-resend-otp",
  display_name: t("AUTH_RESEND_OTP_DISPLAY_NAME"),
  description: t("AUTH_RESEND_OTP_DESCRIPTION"),
  icon: "🔄",
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
      display_name: t("AUTH_RESEND_OTP_TYPE_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: [
          { value: "signup", label: t("AUTH_RESEND_TYPE_SIGNUP") },
          { value: "email_change", label: t("AUTH_RESEND_TYPE_EMAIL_CHANGE") },
          { value: "sms", label: t("AUTH_RESEND_TYPE_SMS") },
          { value: "phone_change", label: t("AUTH_RESEND_TYPE_PHONE_CHANGE") },
        ],
        hint: t("AUTH_RESEND_OTP_TYPE_HINT"),
        width: "medium",
      },
    },
    {
      name: "email",
      type: "string",
      required: false,
      display_name: t("AUTH_EMAIL_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_EMAIL_PLACEHOLDER"),
        hint: t("AUTH_RESEND_EMAIL_HINT"),
        width: "full",
      },
    },
    {
      name: "phone",
      type: "string",
      required: false,
      display_name: t("AUTH_PHONE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_PHONE_PLACEHOLDER"),
        hint: t("AUTH_RESEND_PHONE_HINT"),
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
    if (!type || !RESEND_TYPES.includes(type as (typeof RESEND_TYPES)[number])) {
      return {
        success: false,
        error: `type must be one of: ${RESEND_TYPES.join(", ")}`,
        data: null,
        code: null,
      }
    }
    const email = (parameters.email as string)?.trim()
    const phone = (parameters.phone as string)?.trim()
    if ((type === "signup" || type === "email_change") && !email) {
      return {
        success: false,
        error: "Email is required for signup and email_change.",
        data: null,
        code: null,
      }
    }
    if ((type === "sms" || type === "phone_change") && !phone) {
      return {
        success: false,
        error: "Phone is required for sms and phone_change.",
        data: null,
        code: null,
      }
    }
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const resendParams =
      type === "sms" || type === "phone_change"
        ? { type, phone: phone! }
        : { type: type as "signup" | "email_change", email: email! }
    const result = await supabase.auth.resend(
      resendParams as Parameters<typeof supabase.auth.resend>[0]
    )
    return authResult(result) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
