import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const deepseekCredential = {
  name: "deepseek-api-key",
  display_name: t("DEEPSEEK_API_KEY_DISPLAY_NAME"),
  description: t("DEEPSEEK_API_KEY_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "encrypted_string",
      required: true,
      display_name: t("DEEPSEEK_API_KEY_DISPLAY_NAME"),
      ui: {
        component: "encrypted-input",
        hint: t("DEEPSEEK_API_KEY_HINT"),
        placeholder: t("DEEPSEEK_API_KEY_PLACEHOLDER"),
        width: "full",
      },
    },
  ],
  async authenticate({ args: { credential } }) {
    const apiKey = credential.api_key ?? ""
    if (apiKey === "") {
      throw new Error("credential api_key is empty, please check your credential")
    }
    const headers = new Headers()
    headers.set("Authorization", `Bearer ${apiKey}`)
    return {
      adapter: "openai",
      endpoint: "https://api.deepseek.com/chat/completions",
      headers: Object.fromEntries(headers.entries()),
      api_key: apiKey,
    }
  },
} satisfies CredentialDefinition
