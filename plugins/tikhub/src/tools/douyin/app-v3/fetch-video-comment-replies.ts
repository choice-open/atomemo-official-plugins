import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_video_comment_replies",
  method: "GET",
  path: "/api/v1/douyin/app/v3/fetch_video_comment_replies",
}

export const tikhub_douyin_fetch_video_comment_replies: ToolDefinition = {
  name: "tikhub_douyin_fetch_video_comment_replies",
  display_name: {
    en_US: "Douyin · Get Comment Replies",
    zh_Hans: "抖音 · 获取指定视频的评论回复数据",
  },
  description: {
    en_US: "Get replies to a specific comment on a Douyin video. Supports pagination.",
    zh_Hans: "获取抖音视频指定评论的回复数据，支持分页。",
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
          en_US: "Douyin video/aweme ID that contains the comment.",
          zh_Hans: "包含该评论的抖音作品/视频ID。",
        },
      },
      ui: { hint: { en_US: "Douyin video ID (aweme_id).", zh_Hans: "抖音作品ID。" }, support_expression: true, component: "input", placeholder: { en_US: "Video ID", zh_Hans: "视频ID" }, width: "full" },
    },
    {
      name: "comment_id",
      type: "string",
      required: true,
      display_name: { en_US: "Comment ID", zh_Hans: "评论ID" },
      ai: {
        llm_description: {
          en_US: "The ID of the comment to fetch replies for.",
          zh_Hans: "要获取回复的评论ID。",
        },
      },
      ui: { hint: { en_US: "Douyin comment ID to fetch replies for.", zh_Hans: "要获取回复的抖音评论ID。" }, support_expression: true, component: "input", placeholder: { en_US: "Comment ID", zh_Hans: "评论ID" }, width: "full" },
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
          en_US: "Number of replies per page, default 20.",
          zh_Hans: "每页回复数量，默认 20。",
        },
      },
      ui: { hint: { en_US: "Number of replies per page.", zh_Hans: "每页回复数量。" }, support_expression: true, component: "number-input" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const awemeId = readRequiredStringParam(p, "aweme_id")
    const commentId = readRequiredStringParam(p, "comment_id")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: {
        aweme_id: awemeId,
        comment_id: commentId,
        cursor: typeof p.cursor === "number" ? String(p.cursor) : undefined,
        count: typeof p.count === "number" ? String(p.count) : undefined,
      },
    })
  },
}
