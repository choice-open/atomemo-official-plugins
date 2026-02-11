import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

const MODEL_PREFIX = "openai-"

export const openaiCredential = {
  name: "openai-api-key",
  display_name: t("OPENAI_API_KEY_DISPLAY_NAME"),
  description: t("OPENAI_API_KEY_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "encrypted_string",
      required: true,
      display_name: t("OPENAI_API_KEY_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        hint: t("OPENAI_API_KEY_HINT"),
        placeholder: t("OPENAI_API_KEY_PLACEHOLDER"),
        width: "full",
      },
    },
    {
      name: "organization_id",
      type: "string",
      required: false,
      display_name: t("OPENAI_ORGANIZATION_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("OPENAI_ORGANIZATION_ID_HINT"),
        placeholder: t("OPENAI_ORGANIZATION_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "project_id",
      type: "string",
      required: false,
      display_name: t("OPENAI_PROJECT_ID_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("OPENAI_PROJECT_ID_HINT"),
        placeholder: t("OPENAI_PROJECT_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async authenticate({ args: { credential, extra } }) {
    const modelName = extra?.model ?? "gpt-4o"

    const headers: Record<string, string> = {
      Authorization: `Bearer ${credential.api_key}`,
    }

    if (!!credential.organization_id) {
      headers["OpenAI-Organization"] = credential.organization_id
    }

    if (!!credential.project_id) {
      headers["OpenAI-Project"] = credential.project_id
    }

    return {
      adapter: "openai",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: modelName,
      headers,
    }
  },
} satisfies CredentialDefinition
