import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_note_sub_comments",
  method: "GET",
  path: "/api/v1/xiaohongshu/app_v2/get_note_sub_comments",
}

export const tikhub_rednote_get_note_sub_comments: ToolDefinition = {
  name: "tikhub_rednote_get_note_sub_comments",
  display_name: {
    en_US: "RedNote · Get Note Sub-comments",
    zh_Hans: "小红书 · 获取笔记二级评论列表",
  },
  description: {
    en_US: "Get sub-comment list (replies to a comment) of a Xiaohongshu note.",
    zh_Hans: "获取小红书笔记的二级评论列表（评论的回复）。",
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
      required: false,
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
      required: false,
      display_name: { en_US: "Share Link", zh_Hans: "分享链接" },
      ai: {
        llm_description: {
          en_US: "Share link of the Xiaohongshu post. Required if note_id not provided.",
          zh_Hans: "小红书笔记分享链接。如果未提供笔记ID则必填。",
        },
      },
      ui: { hint: { en_US: "Xiaohongshu share link, e.g. https://www.xiaohongshu.com/...", zh_Hans: "小红书分享链接，如 https://www.xiaohongshu.com/..." },  support_expression: true, component: "input", placeholder: { en_US: "Share link", zh_Hans: "分享链接" }, width: "full" },
    },
    {
      name: "comment_id",
      type: "string",
      required: true,
      display_name: { en_US: "Comment ID", zh_Hans: "父评论ID" },
      ai: {
        llm_description: {
          en_US: "Parent comment ID to fetch sub-comments for.",
          zh_Hans: "父评论ID，用于获取其下的二级评论。",
        },
      },
      ui: { hint: { en_US: "Parent comment ID from the comments list response.", zh_Hans: "父评论 ID，从评论列表接口的返回结果中获取。" },  support_expression: true, component: "input", placeholder: { en_US: "Parent comment ID", zh_Hans: "父评论ID" }, width: "full" },
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      display_name: { en_US: "Cursor", zh_Hans: "分页游标" },
      ai: {
        llm_description: {
          en_US: "Pagination cursor. Leave empty for first page.",
          zh_Hans: "分页游标。首次请求留空。",
        },
      },
      ui: { hint: { en_US: "Leave empty for first request. For pagination, use the cursor from previous response.", zh_Hans: "首次请求留空。翻页时使用上次返回的 cursor 值。" },  support_expression: true, component: "input", placeholder: { en_US: "Leave empty for first page", zh_Hans: "首次请求留空" } },
    },
    {
      name: "index",
      type: "integer",
      required: false,
      display_name: { en_US: "Index", zh_Hans: "分页索引" },
      ai: {
        llm_description: {
          en_US: "Page index. Pass 0 for first request.",
          zh_Hans: "分页索引。首次请求传0。",
        },
      },
      ui: { hint: { en_US: "Pass 0 for first request. Increment for pagination.", zh_Hans: "首次请求传 0。翻页时递增。" },  support_expression: true, component: "number-input" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const index = typeof p.index === "number" ? String(p.index) : undefined
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        note_id: typeof p.note_id === "string" ? p.note_id : undefined,
        share_text: typeof p.share_text === "string" ? p.share_text : undefined,
        comment_id: typeof p.comment_id === "string" ? p.comment_id : undefined,
        cursor: typeof p.cursor === "string" ? p.cursor : undefined,
        index,
      },
    })
  },
}
