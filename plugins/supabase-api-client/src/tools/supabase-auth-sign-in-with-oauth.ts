import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { createSupabaseClient } from "../credentials/supabase-connection"
import { t } from "../i18n/i18n-node"
import { parseJson } from "../lib/auth-result"

const OAUTH_PROVIDERS = [
  "google",
  "github",
  "gitlab",
  "apple",
  "azure",
  "facebook",
  "discord",
  "twitch",
  "twitter",
  "x",
  "slack",
  "spotify",
  "kakao",
  "keycloak",
  "linkedin",
  "notion",
  "bitbucket",
  "figma",
  "workos",
  "zoom",
  "fly",
] as const

export const supabaseAuthSignInWithOAuthTool: ToolDefinition = {
  name: "supabase-auth-sign-in-with-oauth",
  display_name: t("AUTH_SIGN_IN_WITH_OAUTH_DISPLAY_NAME"),
  description: t("AUTH_SIGN_IN_WITH_OAUTH_DESCRIPTION"),
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
      name: "provider",
      type: "string",
      required: true,
      display_name: t("AUTH_OAUTH_PROVIDER_DISPLAY_NAME"),
      ui: {
        component: "select",
        options: [
          { value: "google", label: t("AUTH_OAUTH_PROVIDER_GOOGLE") },
          { value: "github", label: t("AUTH_OAUTH_PROVIDER_GITHUB") },
          { value: "gitlab", label: t("AUTH_OAUTH_PROVIDER_GITLAB") },
          { value: "apple", label: t("AUTH_OAUTH_PROVIDER_APPLE") },
          { value: "azure", label: t("AUTH_OAUTH_PROVIDER_AZURE") },
          { value: "facebook", label: t("AUTH_OAUTH_PROVIDER_FACEBOOK") },
          { value: "discord", label: t("AUTH_OAUTH_PROVIDER_DISCORD") },
          { value: "twitch", label: t("AUTH_OAUTH_PROVIDER_TWITCH") },
          { value: "twitter", label: t("AUTH_OAUTH_PROVIDER_TWITTER") },
          { value: "x", label: t("AUTH_OAUTH_PROVIDER_X") },
          { value: "slack", label: t("AUTH_OAUTH_PROVIDER_SLACK") },
          { value: "spotify", label: t("AUTH_OAUTH_PROVIDER_SPOTIFY") },
          { value: "kakao", label: t("AUTH_OAUTH_PROVIDER_KAKAO") },
          { value: "keycloak", label: t("AUTH_OAUTH_PROVIDER_KEYCLOAK") },
          { value: "linkedin", label: t("AUTH_OAUTH_PROVIDER_LINKEDIN") },
          { value: "notion", label: t("AUTH_OAUTH_PROVIDER_NOTION") },
          { value: "bitbucket", label: t("AUTH_OAUTH_PROVIDER_BITBUCKET") },
          { value: "figma", label: t("AUTH_OAUTH_PROVIDER_FIGMA") },
          { value: "workos", label: t("AUTH_OAUTH_PROVIDER_WORKOS") },
          { value: "zoom", label: t("AUTH_OAUTH_PROVIDER_ZOOM") },
          { value: "fly", label: t("AUTH_OAUTH_PROVIDER_FLY") },
        ],
        hint: t("AUTH_OAUTH_PROVIDER_HINT"),
        width: "medium",
      },
    },
    {
      name: "redirect_to",
      type: "string",
      required: false,
      display_name: t("AUTH_REDIRECT_TO_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_REDIRECT_TO_PLACEHOLDER"),
        hint: t("AUTH_OAUTH_REDIRECT_HINT"),
        width: "full",
      },
    },
    {
      name: "scopes",
      type: "string",
      required: false,
      display_name: t("AUTH_OAUTH_SCOPES_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_OAUTH_SCOPES_PLACEHOLDER"),
        hint: t("AUTH_OAUTH_SCOPES_HINT"),
        width: "full",
      },
    },
    {
      name: "query_params",
      type: "string",
      required: false,
      display_name: t("AUTH_OAUTH_QUERY_PARAMS_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("AUTH_OAUTH_QUERY_PARAMS_PLACEHOLDER"),
        hint: t("AUTH_OAUTH_QUERY_PARAMS_HINT"),
        width: "full",
      },
    },
    {
      name: "skip_browser_redirect",
      type: "boolean",
      required: false,
      display_name: t("AUTH_OAUTH_SKIP_REDIRECT_DISPLAY_NAME"),
      default: true,
      ui: { component: "switch", hint: t("AUTH_OAUTH_SKIP_REDIRECT_HINT") },
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
    const provider = (parameters.provider as string)?.trim()
    if (!provider || !OAUTH_PROVIDERS.includes(provider as (typeof OAUTH_PROVIDERS)[number])) {
      return {
        success: false,
        error: `provider must be one of: ${OAUTH_PROVIDERS.join(", ")}`,
        data: null,
        code: null,
      }
    }
    const redirectTo = (parameters.redirect_to as string)?.trim() || undefined
    const scopes = (parameters.scopes as string)?.trim() || undefined
    const queryParams = parseJson<Record<string, string>>(parameters.query_params as string, {})
    const skipBrowserRedirect = Boolean(parameters.skip_browser_redirect)
    const supabase = createSupabaseClient(cred.supabase_url, cred.supabase_key)
    const result = await supabase.auth.signInWithOAuth({
      provider: provider as (typeof OAUTH_PROVIDERS)[number],
      options: {
        redirectTo,
        scopes,
        queryParams: Object.keys(queryParams).length ? queryParams : undefined,
        skipBrowserRedirect,
      },
    })
    if (result.error) {
      return {
        success: false,
        data: null,
        error: result.error.message,
        code: result.error.code ?? null,
      }
    }
    return {
      success: true,
      data: result.data,
      error: null,
      code: null,
    }
  },
}
