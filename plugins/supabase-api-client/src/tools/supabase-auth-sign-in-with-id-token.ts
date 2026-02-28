import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { authResult, parseJson } from "../lib/auth-result"

const PROVIDERS = ["google", "apple", "azure", "facebook", "kakao"] as const

export const supabaseAuthSignInWithIdTokenTool: ToolDefinition = {
  name: "supabase-auth-sign-in-with-id-token",
  display_name: t("AUTH_SIGN_IN_WITH_ID_TOKEN_DISPLAY_NAME"),
  description: t("AUTH_SIGN_IN_WITH_ID_TOKEN_DESCRIPTION"),
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
      name: "provider",
      type: "string",
      required: true,
      display_name: t("AUTH_ID_TOKEN_PROVIDER_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: [
          { value: "google", label: t("AUTH_ID_TOKEN_PROVIDER_GOOGLE") },
          { value: "apple", label: t("AUTH_ID_TOKEN_PROVIDER_APPLE") },
          { value: "azure", label: t("AUTH_ID_TOKEN_PROVIDER_AZURE") },
          { value: "facebook", label: t("AUTH_ID_TOKEN_PROVIDER_FACEBOOK") },
          { value: "kakao", label: t("AUTH_ID_TOKEN_PROVIDER_KAKAO") },
          { value: "custom", label: t("AUTH_ID_TOKEN_PROVIDER_CUSTOM") },
        ],
        hint: t("AUTH_ID_TOKEN_PROVIDER_HINT"),
        width: "medium",
      },
    },
    {
      name: "provider_custom",
      type: "string",
      required: false,
      display_name: t("AUTH_ID_TOKEN_PROVIDER_CUSTOM_NAME_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_ID_TOKEN_PROVIDER_CUSTOM_PLACEHOLDER"),
        hint: t("AUTH_ID_TOKEN_PROVIDER_CUSTOM_NAME_HINT"),
        width: "full",
      },
    },
    {
      name: "token",
      type: "string",
      required: true,
      display_name: t("AUTH_ID_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,
        placeholder: t("AUTH_ID_TOKEN_PLACEHOLDER"),
        hint: t("AUTH_ID_TOKEN_HINT"),
        width: "full",
      },
    },
    {
      name: "access_token",
      type: "string",
      required: false,
      display_name: t("AUTH_ACCESS_TOKEN_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,
        placeholder: t("AUTH_ACCESS_TOKEN_PLACEHOLDER"),
        hint: t("AUTH_ID_TOKEN_ACCESS_TOKEN_HINT"),
        width: "full",
      },
    },
    {
      name: "nonce",
      type: "string",
      required: false,
      display_name: t("AUTH_ID_TOKEN_NONCE_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_OTP_TOKEN_ID_PLACEHOLDER"),
        hint: t("AUTH_ID_TOKEN_NONCE_HINT"),
        width: "full",
      },
    },
    {
      name: "options",
      type: "string",
      required: false,
      display_name: t("AUTH_ID_TOKEN_OPTIONS_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_SIGN_UP_OPTIONS_PLACEHOLDER"),
        hint: t("AUTH_ID_TOKEN_OPTIONS_HINT"),
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
    let provider = (parameters.provider as string)?.trim()
    if (provider === "custom") {
      const custom = (parameters.provider_custom as string)?.trim()
      if (!custom) {
        return {
          success: false,
          error: "provider_custom is required when provider is custom (e.g. custom:my-oidc-provider).",
          data: null,
          code: null,
        }
      }
      provider = custom.startsWith("custom:") ? custom : `custom:${custom}`
    } else if (!provider || !PROVIDERS.includes(provider as (typeof PROVIDERS)[number])) {
      return {
        success: false,
        error: `provider must be one of: ${PROVIDERS.join(", ")}, or custom.`,
        data: null,
        code: null,
      }
    }
    const token = (parameters.token as string)?.trim()
    if (!token) {
      return {
        success: false,
        error: "token (ID token) is required.",
        data: null,
        code: null,
      }
    }
    const accessToken = (parameters.access_token as string)?.trim() || undefined
    const nonce = (parameters.nonce as string)?.trim() || undefined
    const options = parseJson<{ captchaToken?: string }>(parameters.options as string, {})
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.signInWithIdToken({
      provider: provider as "google" | "apple" | "azure" | "facebook" | "kakao" | `custom:${string}`,
      token,
      ...(accessToken ? { access_token: accessToken } : {}),
      ...(nonce ? { nonce } : {}),
      ...(options.captchaToken ? { options: { captchaToken: options.captchaToken } } : {}),
    })
    return authResult({ data: result.data, error: result.error }) as ReturnType<ToolDefinition["invoke"]> extends Promise<infer R> ? R : never
  },
}
