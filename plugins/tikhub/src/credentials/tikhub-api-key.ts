import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const tikhubApiKeyCredential = {
  name: "tikhub-api-key",
  display_name: {
    en_US: "TikHub API Key",
    zh_Hans: "TikHub API 密钥",
  },
  description: {
    en_US: "API Key from TikHub user dashboard. One key for all platforms.",
    zh_Hans: "从 TikHub 用户后台获取的 API Key。所有平台共用。",
  },
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "encrypted_string",
      required: true,
      display_name: { en_US: "API Key", zh_Hans: "API Key" },
      ui: {
        component: "encrypted-input",
        hint: {
          en_US: "Get your API Key from https://user.tikhub.io",
          zh_Hans: "从 https://user.tikhub.io 获取 API Key",
        },
        sensitive: true,
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
