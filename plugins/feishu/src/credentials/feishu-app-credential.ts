import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const feishuAppCredential = {
  name: "feishu-app-credential",
  display_name: {
    en_US: "Feishu App Credential",
    zh_Hans: "飞书应用凭证",
  },
  description: {
    en_US: "Feishu app_id and app_secret for OpenAPI access.",
    zh_Hans: "用于调用飞书 OpenAPI 的 app_id 与 app_secret。",
  },
  icon: "🔐",
  parameters: [
    {
      name: "app_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "App ID",
        zh_Hans: "App ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Your Feishu application app_id.",
          zh_Hans: "飞书应用的 app_id。",
        },
        width: "full",
      },
    },
    {
      name: "app_secret",
      type: "encrypted_string",
      required: true,
      display_name: {
        en_US: "App Secret",
        zh_Hans: "App Secret",
      },
      ui: {
        component: "encrypted-input",
        hint: {
          en_US: "Your Feishu application app_secret.",
          zh_Hans: "飞书应用的 app_secret。",
        },
        sensitive: true,
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition
