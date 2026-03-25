import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const jwtCredential = {
  name: "jwt-secret",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  description: t("CREDENTIAL_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "secret_key",
      type: "encrypted_string",
      required: true,
      display_name: t("CREDENTIAL_SECRET_KEY_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        sensitive: true,
        hint: t("CREDENTIAL_SECRET_KEY_HINT"),
        placeholder: t("CREDENTIAL_SECRET_KEY_PLACEHOLDER"),
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
