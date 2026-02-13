import type { CredentialDefinition, PropertyEncryptedString } from "@choiceopen/atomemo-plugin-schema/types";
import { t } from "../i18n/i18n-node";
import { CREDENTIAL_NAME } from "../tools/_shared-parameters/credential";

export const secretCredential: CredentialDefinition = {
  name: CREDENTIAL_NAME,
  display_name: t("CREDENTIAL_DISPLAY_NAME"),
  description: t("CREDENTIAL_LLM_DESCRIPTION"),
  icon: "w",
  parameters: [
    {
      name: "api_key",
      type: "encrypted_string",
      required: true,
    } satisfies PropertyEncryptedString<"api_key">,
  ],
};
