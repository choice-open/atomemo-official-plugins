import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_topic_info",
  method: "GET",
  path: "/api/v1/xiaohongshu/app_v2/get_topic_info",
}

export const tikhub_rednote_get_topic_info: ToolDefinition = {
  name: "tikhub_rednote_get_topic_info",
  display_name: {
    en_US: "RedNote · Get Topic Info",
    zh_Hans: "小红书 · 获取话题详情",
  },
  description: {
    en_US: "Get Xiaohongshu topic detail by topic page ID.",
    zh_Hans: "通过话题页面 ID 获取小红书话题详情。",
  },
  icon: "📕",
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
      name: "page_id",
      type: "string",
      required: true,
      display_name: { en_US: "Page ID", zh_Hans: "话题页面ID" },
      ai: {
        llm_description: {
          en_US: "Topic page ID.",
          zh_Hans: "话题页面ID。",
        },
      },
      ui: { hint: { en_US: "Topic page ID, can be extracted from topic URL.", zh_Hans: "话题页面 ID，可从话题链接中提取。" },  support_expression: true, component: "input", placeholder: { en_US: "Topic page ID", zh_Hans: "话题页面ID" }, width: "full" },
    },
    {
      name: "source",
      type: "string",
      required: false,
      default: "normal",
      display_name: { en_US: "Source", zh_Hans: "来源" },
      ai: {
        llm_description: {
          en_US: "Source identifier.",
          zh_Hans: "来源标识。",
        },
      },
      ui: { hint: { en_US: "Source identifier. Usually not needed.", zh_Hans: "来源标识，通常无需填写。" },  support_expression: true, component: "input" },
    },
    {
      name: "note_id",
      type: "string",
      required: false
      display_name: { en_US: "Source Note ID", zh_Hans: "来源笔记ID" },
      ai: {
        llm_description: {
          en_US: "Note ID of the Xiaohongshu post. Required if share_text not provided.",
          zh_Hans: "小红书笔记ID。如果未提供分享链接则必填。",
        },
      },
      ui: { hint: { en_US: "Xiaohongshu note ID, can be extracted from note URL.", zh_Hans: "小红书笔记 ID，可从笔记链接中提取。" },  support_expression: true, component: "input", placeholder: { en_US: "Note ID when jumping from a note", zh_Hans: "从笔记跳转时传入" } },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        page_id: typeof p.page_id === "string" ? p.page_id : undefined,
        source: typeof p.source === "string" ? p.source : undefined,
        note_id: typeof p.note_id === "string" ? p.note_id : undefined,
      },
    })
  },
}
