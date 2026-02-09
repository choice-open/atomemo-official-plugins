import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const demoCredential = {
  name: "demo-deepseek-api-key",
  display_name: t("DEMO_DEEPSEEK_API_KEY_DISPLAY_NAME"),
  description: t("DEMO_DEEPSEEK_API_KEY_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "string",
      required: true,
      display_name: t("DEMO_DEEPSEEK_API_KEY_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("DEMO_DEEPSEEK_API_KEY_HINT"),
        placeholder: t("DEMO_DEEPSEEK_API_KEY_PLACEHOLDER"),
        sensitive: true,
        support_expression: true,
        width: "full",
      },
    },
  ],
  async authenticate({ args: { credentials, parameters } }) {
    const model = parameters.model ?? "deepseek-chat"

    return {
      adapter: "deepseek",
      endpoint: "https://api.deepseek.com/chat/completions",
      model,
      headers: {
        Authorization: `Bearer ${credentials.api_key}`,
      },
    }
  },
} satisfies CredentialDefinition
