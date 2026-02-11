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
      type: "string",
      required: true,
      display_name: t("OPENAI_API_KEY_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("OPENAI_API_KEY_HINT"),
        placeholder: t("OPENAI_API_KEY_PLACEHOLDER"),
        sensitive: true,
        support_expression: true,
        width: "full",
      },
    },
  ],
  async authenticate({ args: { credential, extra } }) {
    let modelName = "gpt-4o"

    if (typeof extra?.model === "string") {
      modelName = extra.model.startsWith(MODEL_PREFIX)
        ? extra.model.slice(MODEL_PREFIX.length)
        : extra.model
    }

    return {
      adapter: "openai",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: modelName,
      headers: {
        Authorization: `Bearer ${credential.api_key}`,
      },
    }
  },
} satisfies CredentialDefinition
