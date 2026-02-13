import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const firecrawlCredential = {
  name: "firecrawl",
  display_name: {
    en_US: "Firecrawl API Key",
    zh_Hans: "Firecrawl API 密钥",
  },
  description: {
    en_US: "API key used to authenticate Firecrawl API requests.",
    zh_Hans: "用于鉴权 Firecrawl API 请求的 API 密钥。",
  },
  icon: "🔥",
  parameters: [
    {
      name: "api_key",
      type: "string",
      required: true,
      display_name: {
        en_US: "Firecrawl API Key",
        zh_Hans: "Firecrawl API 密钥",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Paste your Firecrawl API key (starts with fc-).",
          zh_Hans: "粘贴 Firecrawl API 密钥（以 fc- 开头）。",
        },
        placeholder: {
          en_US: "fc-xxxxxxxxxxxxxxxx",
          zh_Hans: "fc-xxxxxxxxxxxxxxxx",
        },
        sensitive: true,
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
