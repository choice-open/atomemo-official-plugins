import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export { createSupabaseClient } from "../lib/get-supabase-client"

export const supabaseCredential = {
  name: "supabase-connection",
  display_name: t("SUPABASE_CREDENTIAL_DISPLAY_NAME"),
  description: t("SUPABASE_CREDENTIAL_DESCRIPTION"),
  icon: "🔗",
  parameters: [
    {
      name: "supabase_url",
      type: "string",
      required: true,
      display_name: t("SUPABASE_URL_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("SUPABASE_URL_PLACEHOLDER"),
        hint: t("SUPABASE_URL_HINT"),
        width: "full",
      },
    },
    {
      name: "supabase_key",
      type: "string",
      required: true,
      display_name: t("SUPABASE_KEY_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,
        placeholder: t("SUPABASE_KEY_PLACEHOLDER"),
        hint: t("SUPABASE_KEY_HINT"),
        width: "full",
      },
    },
  ],
  // async authenticate({ args }: { args: { credential: Record<string, string | null | undefined> } }) {
  //   const api_key = args.credential.supabase_key ?? ""
  //   return {
  //     adapter: "openai" as const,
  //     api_key,
  //     endpoint: "https://api.openai.com/v1",
  //   }
  // },
} satisfies CredentialDefinition
