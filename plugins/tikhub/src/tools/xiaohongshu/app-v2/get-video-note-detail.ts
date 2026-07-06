import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_video_note_detail",
  method: "GET",
  path: "/api/v1/xiaohongshu/app_v2/get_video_note_detail",
}

export const tikhub_rednote_get_video_note_detail: ToolDefinition = {
  name: "tikhub_rednote_get_video_note_detail",
  display_name: {
    en_US: "RedNote · Get Video Note Detail",
    zh_Hans: "小红书 · 获取视频笔记详情",
  },
  description: {
    en_US: "Get Xiaohongshu video note detail by note ID or share link.",
    zh_Hans: "通过笔记 ID 或分享链接获取小红书视频笔记详情。",
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
      name: "note_id",
      type: "string",
      required: false
      display_name: { en_US: "Note ID", zh_Hans: "笔记ID" },
      ai: {
        llm_description: {
          en_US: "Note ID of the Xiaohongshu post. Required if share_text not provided.",
          zh_Hans: "小红书笔记ID。如果未提供分享链接则必填。",
        },
      },
      ui: { hint: { en_US: "Xiaohongshu note ID, can be extracted from note URL.", zh_Hans: "小红书笔记 ID，可从笔记链接中提取。" },  support_expression: true, component: "input", placeholder: { en_US: "Note ID", zh_Hans: "笔记ID" }, width: "full" },
    },
    {
      name: "share_text",
      type: "string",
      required: false
      display_name: { en_US: "Share Link", zh_Hans: "分享链接" },
      ai: {
        llm_description: {
          en_US: "Share link of the Xiaohongshu post. Required if note_id not provided.",
          zh_Hans: "小红书笔记分享链接。如果未提供笔记ID则必填。",
        },
      },
      ui: { hint: { en_US: "Xiaohongshu share link, e.g. https://www.xiaohongshu.com/...", zh_Hans: "小红书分享链接，如 https://www.xiaohongshu.com/..." },  support_expression: true, component: "input", placeholder: { en_US: "Share link", zh_Hans: "分享链接" }, width: "full" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        note_id: typeof p.note_id === "string" ? p.note_id : undefined,
        share_text: typeof p.share_text === "string" ? p.share_text : undefined,
      },
    })
  },
}
