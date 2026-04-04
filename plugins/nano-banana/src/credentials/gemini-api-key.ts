import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const geminiApiKeyCredential = {
  name: "gemini-api-key",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  description: t("CREDENTIAL_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "encrypted_string",
      required: true,
      display_name: t("CREDENTIAL_API_KEY_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        hint: t("CREDENTIAL_API_KEY_HINT"),
        placeholder: t("CREDENTIAL_API_KEY_PLACEHOLDER"),
        sensitive: true,
        width: "full",
      },
    },
    {
      name: "base_url",
      type: "string",
      required: false,
      display_name: t("CREDENTIAL_BASE_URL_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CREDENTIAL_BASE_URL_HINT"),
        placeholder: t("CREDENTIAL_BASE_URL_PLACEHOLDER"),
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
