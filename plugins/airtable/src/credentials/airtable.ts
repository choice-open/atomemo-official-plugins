import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const airtableCredential = {
  name: "airtable",
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
        sensitive: true,
        hint: t("CREDENTIAL_API_KEY_HINT"),
        placeholder: t("CREDENTIAL_API_KEY_PLACEHOLDER"),
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
