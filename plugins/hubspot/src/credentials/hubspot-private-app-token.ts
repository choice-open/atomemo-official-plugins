import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const hubspotPrivateAppTokenCredential = {
  name: "hubspot-private-app-token",
  display_name: t("CREDENTIAL_TOKEN_DISPLAY_NAME"),
  description: t("CREDENTIAL_TOKEN_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "access_token",
      type: "encrypted_string",
      required: true,
      display_name: t("CREDENTIAL_TOKEN_ACCESS_TOKEN_LABEL"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("CREDENTIAL_TOKEN_ACCESS_TOKEN_HINT"),
        placeholder: t("CREDENTIAL_TOKEN_ACCESS_TOKEN_PLACEHOLDER"),
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
