import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_user_contact",
  method: "GET",
  path: "/api/v1/linkedin/web/get_user_contact",
}

export const tikhub_linkedin_get_user_contact: ToolDefinition = {
  name: "tikhub_linkedin_get_user_contact",
  display_name: {
    en_US: "LinkedIn · Get User Contact Info",
    zh_Hans: "LinkedIn · 获取用户联系信息",
  },
  description: {
    en_US: "Get LinkedIn user contact information (email, phone, social links, etc.) by username.",
    zh_Hans: "通过用户名获取 LinkedIn 用户的联系信息（邮箱、电话、社交链接等）。",
  },
  icon: "💼",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "tikhub-api-key",
      display_name: { en_US: "Credential", zh_Hans: "凭证" },
      ui: { component: "credential-select" },
    },
    {
      name: "username",
      type: "string",
      required: true,
      display_name: { en_US: "Username", zh_Hans: "用户名" },
      ai: {
        llm_description: {
          en_US: "LinkedIn username to fetch contact information for.",
          zh_Hans: "要获取联系信息的 LinkedIn 用户名。",
        },
      },
      ui: { hint: { en_US: "LinkedIn username, e.g. john-doe-123456.", zh_Hans: "LinkedIn 用户名，如 john-doe-123456。" }, support_expression: true, component: "input", placeholder: { en_US: "e.g. john-doe-123456", zh_Hans: "如：john-doe-123456" }, width: "full" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const username = readRequiredStringParam(p, "username")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        username,
      },
    })
  },
}
