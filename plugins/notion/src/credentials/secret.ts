import type { CredentialDefinition, PropertyEncryptedString } from "@choiceopen/atomemo-plugin-schema/types";
import { t } from "../i18n/i18n-node";

export const secretCredential: CredentialDefinition = {
  name: "notion",
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  description: t("CREDENTIAL_LLM_DESCRIPTION"),
  icon: "w",
  parameters: [
    {
      name: "token",
      type: "encrypted_string",
      required: true,
    } satisfies PropertyEncryptedString<"token">,
  ],
};
