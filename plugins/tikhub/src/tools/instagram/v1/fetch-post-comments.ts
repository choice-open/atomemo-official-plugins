import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  commentSortOrderValues,
  credentialParameter,
  instagramSelectParameter,
  instagramStringParameter,
  invokeInstagramGet,
  readCommentSortOrder,
  readOptionalStringParam,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "instagram_v1_fetch_post_comments_v2",
  method: "GET",
  path: "/api/v1/instagram/v1/fetch_post_comments_v2",
}

export const tikhub_instagram_post_comments: ToolDefinition = {
  name: "tikhub_instagram_post_comments",
  display_name: {
    en_US: "Instagram · Post Comments",
    zh_Hans: "Instagram · 帖子评论",
  },
  description: {
    en_US: "Fetch comments for an Instagram post.",
    zh_Hans: "获取 Instagram 帖子评论列表。",
  },
  icon: "📸",
  parameters: [
    credentialParameter,
    instagramStringParameter({
      name: "media_id",
      required: true,
      displayName: { en_US: "Media ID", zh_Hans: "媒体 ID" },
      hint: {
        en_US: "Required Instagram media ID. Keep it as a string.",
        zh_Hans: "必填 Instagram 媒体 ID，按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Instagram post media ID. Treat it as a string and never convert it to a number.",
        zh_Hans: "必填 Instagram 帖子媒体 ID。按字符串处理，不要转成数字。",
      },
      placeholder: {
        en_US: "3766120364183949816",
        zh_Hans: "3766120364183949816",
      },
    }),
    instagramSelectParameter({
      name: "sort_order",
      values: commentSortOrderValues,
      default: "recent",
      displayName: { en_US: "Sort Order", zh_Hans: "评论排序" },
      hint: {
        en_US: "OpenAPI default recent. Choose popular or recent.",
        zh_Hans: "OpenAPI 默认 recent。可选 popular 或 recent。",
      },
      llmDescription: {
        en_US:
          "Comment sort order. Valid values: popular, recent. OpenAPI default is recent.",
        zh_Hans: "评论排序。有效值：popular、recent。OpenAPI 默认 recent。",
      },
    }),
    instagramStringParameter({
      name: "min_id",
      displayName: { en_US: "Min ID", zh_Hans: "分页 min_id" },
      hint: {
        en_US:
          "Optional opaque pagination cursor from next_min_id. Pass it unchanged.",
        zh_Hans: "可选不透明分页 cursor，来自 next_min_id，翻页时原样传回。",
      },
      llmDescription: {
        en_US:
          "Opaque comments pagination cursor from next_min_id. Do not parse, decode, or rewrite it.",
        zh_Hans: "评论分页 cursor，来自 next_min_id。不要解析、解码或改写。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeInstagramGet(endpoint, args, {
      media_id: readTrimmedRequired(p, "media_id", "media_id"),
      sort_order: readCommentSortOrder(p),
      min_id: readOptionalStringParam(p, "min_id"),
    })
  },
}
