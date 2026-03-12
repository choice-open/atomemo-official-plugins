import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const googleSearchApiCredential = {
  name: "google-search-api",
  display_name: t("GOOGLE_SEARCH_CREDENTIAL_DISPLAY_NAME"),
  description: t("GOOGLE_SEARCH_CREDENTIAL_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "string",
      required: true,
      display_name: t("API_KEY_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,
        placeholder: t("API_KEY_PLACEHOLDER"),
        hint: t("GOOGLE_API_KEY_HINT"),
      },
    },
    {
      name: "search_engine_id",
      type: "string",
      required: true,
      display_name: t("SEARCH_ENGINE_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        placeholder: t("SEARCH_ENGINE_ID_PLACEHOLDER"),
        hint: t("SEARCH_ENGINE_ID_HINT"),
      },
    },
  ],
} satisfies CredentialDefinition
