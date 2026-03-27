import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const uploadPostCredential = {
  name: "upload-post-api-key",
  display_name: {
    en_US: "Upload-Post API Key",
    zh_Hans: "Upload-Post API Key",
  },
  description: {
    en_US: "API key used to authenticate Upload-Post API requests.",
    zh_Hans: "用于 Upload-Post API 请求鉴权的 API Key。",
  },
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "encrypted_string",
      required: true,
      display_name: {
        en_US: "Upload-Post API Key",
        zh_Hans: "Upload-Post API Key",
      },
      ui: {
        component: "encrypted-input",
        hint: {
          en_US: "Paste your Upload-Post API key.",
          zh_Hans: "输入你的 Upload-Post API Key。",
        },
        placeholder: {
          en_US: "up_********************************",
          zh_Hans: "up_********************************",
        },
        sensitive: true,
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
