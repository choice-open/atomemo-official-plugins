import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  commentSortValues,
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readOptionalStringParam,
  readRedditPostId,
  readTrimmedRequired,
  redditSelectParameter,
  redditStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_comment_replies",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_comment_replies",
}

export const tikhub_reddit_comment_replies: ToolDefinition = {
  name: "tikhub_reddit_comment_replies",
  display_name: {
    en_US: "Reddit · Get Comment Replies",
    zh_Hans: "Reddit · 获取评论回复",
  },
  description: {
    en_US:
      "Fetch replies below a Reddit comment node using the opaque more.cursor value.",
    zh_Hans: "使用不透明 more.cursor 获取 Reddit 评论节点下的回复。",
  },
  icon: "👽",
  parameters: [
    credentialParameter,
    redditStringParameter({
      name: "post_id",
      required: true,
      pattern: "^t3_.+",
      displayName: { en_US: "Post ID", zh_Hans: "帖子 ID" },
      hint: {
        en_US: "Required Reddit post ID with the t3_ prefix.",
        zh_Hans: "必填 Reddit 帖子 ID，必须保留 t3_ 前缀。",
      },
      llmDescription: {
        en_US:
          "Reddit post fullname. Keep the t3_ prefix and do not convert it to a number.",
        zh_Hans: "Reddit 帖子 fullname。保留 t3_ 前缀，不要转成数字。",
      },
    }),
    redditStringParameter({
      name: "cursor",
      required: true,
      displayName: { en_US: "Comment Cursor", zh_Hans: "评论 cursor" },
      hint: {
        en_US:
          "Required more.cursor value from a first-level comment node; pass it unchanged.",
        zh_Hans: "必填一级评论节点的 more.cursor；必须原样传递。",
      },
      llmDescription: {
        en_US:
          "Opaque Reddit commenttree cursor, often like commenttree:ex:(...). Do not parse, decode, truncate, or rewrite it.",
        zh_Hans:
          "不透明 Reddit commenttree cursor，常形如 commenttree:ex:(...)。不要解析、解码、截断或改写。",
      },
      placeholder: {
        en_US: "commenttree:ex:(...)",
        zh_Hans: "commenttree:ex:(...)",
      },
    }),
    redditSelectParameter({
      name: "sort_type",
      values: commentSortValues,
      default: "CONFIDENCE",
      displayName: { en_US: "Sort Type", zh_Hans: "评论排序" },
      hint: {
        en_US: "OpenAPI default CONFIDENCE.",
        zh_Hans: "OpenAPI 默认 CONFIDENCE。",
      },
      llmDescription: {
        en_US:
          "Reply sort. Valid values: CONFIDENCE, NEW, TOP, HOT, CONTROVERSIAL, OLD, RANDOM.",
        zh_Hans:
          "回复排序。有效值：CONFIDENCE、NEW、TOP、HOT、CONTROVERSIAL、OLD、RANDOM。",
      },
    }),
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeRedditGet(endpoint, args, {
      post_id: readRedditPostId(p),
      cursor: readTrimmedRequired(p, "cursor", "cursor"),
      sort_type: readOptionalStringParam(p, "sort_type") ?? "CONFIDENCE",
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
