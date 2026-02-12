import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-schema/types";
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
      display_name: {
        en_US: "Notion integration token",
      },
      ai: {
        llm_description: {
          en_US: "Internal integration token used to call the Notion API.",
        },
      },
      ui: {
        component: "encrypted-input",
        placeholder: {
          en_US: "secret_xxxxx",
        },
      },
    },
  ],
  authenticate: async ({ args }) => {
    const token = args.credential.token ?? "";

    return {
      // Adapter is required by the schema but not used for Notion tools.
      adapter: "openai",
      endpoint: "https://api.notion.com/v1",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
          }
        : null,
    };
  },
};
