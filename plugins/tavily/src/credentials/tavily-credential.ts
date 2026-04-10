import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const tavilyCredential = {
  name: "tavily",
  display_name: { en_US: "Tavily API Key", zh_Hans: "Tavily API 密钥" },
  description: { en_US: "Store your Tavily API key securely", zh_Hans: "安全存储你的 Tavily API 密钥" },
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "encrypted_string",
      required: true,
      display_name: { en_US: "API Key", zh_Hans: "API 密钥" },
      ui: {
        component: "encrypted-input",
        placeholder: { en_US: "tvly-YOUR_API_KEY", zh_Hans: "tvly-YOUR_API_KEY" },
        support_expression: false,
      },
    },
  ],
} satisfies CredentialDefinition

