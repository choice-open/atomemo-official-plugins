import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"

export const clickhouseCredential = {
  name: "clickhouse-connection",
  display_name: {
    en_US: "ClickHouse Connection",
    zh_Hans: "ClickHouse 连接",
  },
  description: {
    en_US: "Connection settings for a ClickHouse instance.",
    zh_Hans: "ClickHouse 实例的连接配置。",
  },
  icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/clickhouse.png",
  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      display_name: {
        en_US: "ClickHouse URL",
        zh_Hans: "ClickHouse 地址",
      },
      ui: {
        component: "input",
        placeholder: {
          en_US: "http://localhost:8123",
          zh_Hans: "http://localhost:8123",
        },
        width: "full",
        support_expression: false,
      },
    },
    {
      name: "username",
      type: "string",
      required: false,
      display_name: {
        en_US: "Username",
        zh_Hans: "用户名",
      },
      default: "default",
      ui: {
        component: "input",
        width: "full",
        support_expression: false,
      },
    },
    {
      name: "password",
      type: "string",
      required: false,
      display_name: {
        en_US: "Password",
        zh_Hans: "密码",
      },
      ui: {
        component: "input",
        sensitive: true,
        width: "full",
        support_expression: false,
      },
    },
    {
      name: "database",
      type: "string",
      required: false,
      display_name: {
        en_US: "Default Database",
        zh_Hans: "默认数据库",
      },
      default: "default",
      ui: {
        component: "input",
        width: "full",
        support_expression: false,
      },
    },
  ],
  // This credential is intended for Tool usage only.
  // async authenticate() {
  //   throw new Error("ClickHouse credential is intended for Tool usage only.")
  // },
} satisfies CredentialDefinition

