import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "get_post_comments",
  method: "GET",
  path: "/api/v1/linkedin/web/get_post_comments",
}

export const tikhub_linkedin_get_post_comments: ToolDefinition = {
  name: "tikhub_linkedin_get_post_comments",
  display_name: {
    en_US: "LinkedIn · Get Post Comments",
    zh_Hans: "LinkedIn · 获取帖子评论",
  },
  description: {
    en_US: "Get comments of a LinkedIn post by post ID, with optional sort and type filters.",
    zh_Hans: "通过帖子 ID 获取 LinkedIn 帖子的评论列表，支持排序和类型筛选。",
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
      name: "post_id",
      type: "string",
      required: true,
      display_name: { en_US: "Post ID", zh_Hans: "帖子ID" },
      ai: {
        llm_description: {
          en_US: "LinkedIn post ID to fetch comments for.",
          zh_Hans: "要获取评论的 LinkedIn 帖子 ID。",
        },
      },
      ui: { hint: { en_US: "LinkedIn post ID, can be extracted from post URL.", zh_Hans: "LinkedIn 帖子 ID，可从帖子链接中提取。" }, support_expression: true, component: "input", placeholder: { en_US: "Post ID", zh_Hans: "帖子ID" }, width: "full" },
    },
    {
      name: "page",
      type: "integer",
      required: false,
      default: 1,
      display_name: { en_US: "Page", zh_Hans: "页码" },
      ai: {
        llm_description: {
          en_US: "Page number, starting from 1.",
          zh_Hans: "页码，从 1 开始。",
        },
      },
      ui: { hint: { en_US: "Page number, starting from 1.", zh_Hans: "页码，从 1 开始。" }, support_expression: true, component: "number-input" },
    },
    {
      name: "sort_order",
      type: "string",
      required: false,
      default: "relevance",
      display_name: { en_US: "Sort Order", zh_Hans: "排序方式" },
      ai: {
        llm_description: {
          en_US: "Sort order for comments. Must be one of: relevance (most relevant, default), recent (newest).",
          zh_Hans: "评论排序方式。可选值：relevance（最相关，默认），recent（最新）。",
        },
      },
      ui: { hint: { en_US: "relevance = most relevant, recent = newest.", zh_Hans: "relevance = 最相关，recent = 最新。" }, support_expression: true, component: "select" },
      enum: ["relevance", "recent"],
    },
    {
      name: "post_type",
      type: "string",
      required: false,
      default: "activity",
      display_name: { en_US: "Post Type", zh_Hans: "帖子类型" },
      ai: {
        llm_description: {
          en_US: "Post type. Must be one of: activity (default), ugc.",
          zh_Hans: "帖子类型。可选值：activity（默认），ugc。",
        },
      },
      ui: { hint: { en_US: "activity (default) or ugc.", zh_Hans: "activity（默认）或 ugc。" }, support_expression: true, component: "select" },
      enum: ["activity", "ugc"],
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const page = typeof p.page === "number" ? String(p.page) : undefined
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        post_id: typeof p.post_id === "string" ? p.post_id : undefined,
        page,
        sort_order: typeof p.sort_order === "string" ? p.sort_order : undefined,
        post_type: typeof p.post_type === "string" ? p.post_type : undefined,
      },
    })
  },
}
