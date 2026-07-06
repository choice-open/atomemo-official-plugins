import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_note_comments",
  method: "GET",
  path: "/api/v1/xiaohongshu/app_v2/get_note_comments",
}

export const tikhub_rednote_get_note_comments: ToolDefinition = {
  name: "tikhub_rednote_get_note_comments",
  display_name: {
    en_US: "RedNote · Get Note Comments",
    zh_Hans: "小红书 · 获取笔记评论列表",
  },
  description: {
    en_US: "Get comment list of a Xiaohongshu note by note ID or share link.",
    zh_Hans: "通过笔记 ID 或分享链接获取小红书笔记的评论列表。",
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
      default: "",
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
      default: "",
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
      name: "cursor",
      type: "string",
      required: false,
      default: "",
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
      default: 0,
      display_name: { en_US: "Index", zh_Hans: "评论索引" },
      ai: {
        llm_description: {
          en_US: "Page index. Pass 0 for first request.",
          zh_Hans: "分页索引。首次请求传0。",
        },
      },
      ui: { hint: { en_US: "Pass 0 for first request. Increment for pagination.", zh_Hans: "首次请求传 0。翻页时递增。" },  support_expression: true, component: "number-input" },
    },
    {
      name: "page_area",
      type: "string",
      required: false,
      default: "UNFOLDED",
      display_name: { en_US: "Page Area", zh_Hans: "折叠状态" },
      ai: {
        llm_description: {
          en_US: "Page area state. Must be one of: UNFOLDED (default), FOLDED.",
          zh_Hans: "折叠状态。可选值：UNFOLDED（默认-展开），FOLDED（折叠）。",
        },
      },
      ui: { hint: { en_US: "Page area state: \"UNFOLDED\" = expanded, \"FOLDED\" = folded.", zh_Hans: "折叠状态：\"UNFOLDED\" = 展开，\"FOLDED\" = 折叠。" },  support_expression: true, component: "select" },
      enum: ["UNFOLDED", "FOLDED"],
    },
    {
      name: "sort_strategy",
      type: "string",
      required: false,
      default: "latest_v2",
      display_name: { en_US: "Sort Strategy", zh_Hans: "排序策略" },
      ai: {
        llm_description: {
          en_US: "Sort strategy. Must be one of: default, latest_v2, like_count.",
          zh_Hans: "排序策略。可选值：default（默认），latest_v2（最新），like_count（按点赞数）。",
        },
      },
      ui: { hint: { en_US: "Sort strategy: \"default\", \"latest_v2\" = newest, \"like_count\" = by likes.", zh_Hans: "排序策略：\"default\" = 默认，\"latest_v2\" = 最新，\"like_count\" = 按点赞。" },  support_expression: true, component: "select" },
      enum: ["default", "latest_v2", "like_count"],
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
        cursor: typeof p.cursor === "string" ? p.cursor : undefined,
        index,
        pageArea: typeof p.page_area === "string" ? p.page_area : undefined,
        sort_strategy: typeof p.sort_strategy === "string" ? p.sort_strategy : undefined,
      },
    })
  },
}
