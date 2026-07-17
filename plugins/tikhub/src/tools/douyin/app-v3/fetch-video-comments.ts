import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_video_comments",
  method: "GET",
  path: "/api/v1/douyin/app/v3/fetch_video_comments",
}

export const tikhub_douyin_fetch_video_comments: ToolDefinition = {
  name: "tikhub_douyin_fetch_video_comments",
  display_name: {
    en_US: "Douyin · Get Video Comments",
    zh_Hans: "抖音 · 获取单个视频评论数据",
  },
  description: {
    en_US: "Get comments for a single Douyin video by video ID. Supports pagination.",
    zh_Hans: "通过视频ID获取抖音单个视频的评论数据，支持分页。",
  },
  icon: "🎬",
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
      name: "aweme_id",
      type: "string",
      required: true,
      display_name: { en_US: "Video ID", zh_Hans: "视频ID" },
      ai: {
        llm_description: {
          en_US: "Douyin video/aweme ID to fetch comments for.",
          zh_Hans: "要获取评论的抖音作品/视频ID。",
        },
      },
      ui: { hint: { en_US: "Douyin video ID (aweme_id).", zh_Hans: "抖音作品ID。" }, support_expression: true, component: "input", placeholder: { en_US: "Video ID", zh_Hans: "视频ID" }, width: "full" },
    },
    {
      name: "cursor",
      type: "integer",
      required: false,
      default: 0,
      display_name: { en_US: "Cursor", zh_Hans: "游标" },
      ai: {
        llm_description: {
          en_US: "Pagination cursor, starting from 0.",
          zh_Hans: "分页游标，从 0 开始。",
        },
      },
      ui: { hint: { en_US: "Pagination cursor, default 0.", zh_Hans: "分页游标，默认 0。" }, support_expression: true, component: "number-input" },
    },
    {
      name: "count",
      type: "integer",
      required: false,
      default: 20,
      display_name: { en_US: "Count", zh_Hans: "数量" },
      ai: {
        llm_description: {
          en_US: "Number of comments per page, default 20.",
          zh_Hans: "每页评论数量，默认 20。",
        },
      },
      ui: { hint: { en_US: "Number of comments per page.", zh_Hans: "每页评论数量。" }, support_expression: true, component: "number-input" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const awemeId = readRequiredStringParam(p, "aweme_id")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        aweme_id: awemeId,
        cursor: typeof p.cursor === "number" ? String(p.cursor) : undefined,
        count: typeof p.count === "number" ? String(p.count) : undefined,
      },
    })
  },
}
