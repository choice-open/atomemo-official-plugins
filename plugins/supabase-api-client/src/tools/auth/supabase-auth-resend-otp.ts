import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { authResult } from "../../lib/auth-result"
import { getSupabaseClientFromArgs } from "../../lib/get-supabase-client"

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
    const { supabase } = getSupabaseClientFromArgs(parameters, credentials)
    const type = (parameters.type as string)?.trim()
    if (
      !type ||
      !RESEND_TYPES.includes(type as (typeof RESEND_TYPES)[number])
    ) {
      throw new Error(`type must be one of: ${RESEND_TYPES.join(", ")}`)
    }
    const email = (parameters.email as string)?.trim()
    const phone = (parameters.phone as string)?.trim()
    if ((type === "signup" || type === "email_change") && !email) {
      throw new Error("Email is required for signup and email_change.")
    }
    if ((type === "sms" || type === "phone_change") && !phone) {
      throw new Error("Phone is required for sms and phone_change.")
    }
    const resendParams =
      type === "sms" || type === "phone_change"
        ? { type, phone: phone! }
        : { type: type as "signup" | "email_change", email: email! }
    const result = await supabase.auth.resend(
      resendParams as Parameters<typeof supabase.auth.resend>[0],
    )
    return authResult(result) as ReturnType<
      ToolDefinition["invoke"]
    > extends Promise<infer R>
      ? R
      : never
  },
}
