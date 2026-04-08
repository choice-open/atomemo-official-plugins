import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";

export const feishuAppCredential = {
  name: "feishu-app-credential",
  display_name: {
    en_US: "Feishu App Credential",
    zh_Hans: "飞书应用凭证",
  },
  description: {
    en_US: "App ID and App Secret for Feishu Open Platform",
    zh_Hans: "用于飞书开放平台的 App ID 与 App Secret",
  },
  icon: "🔐",
  parameters: [
    {
      name: "app_id",
      type: "encrypted_string",
      required: true,
      display_name: {
        en_US: "App ID",
        zh_Hans: "App ID",
      },
      ui: {
        component: "encrypted-input",
        hint: {
          en_US: "Feishu app_id from Open Platform",
          zh_Hans: "飞书开放平台中的 app_id",
        },
        placeholder: "cli_xxx",
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
          en_US: "Feishu app_secret from Open Platform",
          zh_Hans: "飞书开放平台中的 app_secret",
        },
        placeholder: "xxxxxxxx",
        width: "full",
      },
    },
  ],
} satisfies CredentialDefinition;
