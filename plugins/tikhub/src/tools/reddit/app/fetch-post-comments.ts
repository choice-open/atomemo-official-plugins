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
  redditSelectParameter,
  redditStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_post_comments",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_post_comments",
}

export const tikhub_reddit_post_comments: ToolDefinition = {
  name: "tikhub_reddit_post_comments",
  display_name: {
    en_US: "Reddit · Get Post Comments",
    zh_Hans: "Reddit · 获取帖子一级评论",
  },
  description: {
    en_US:
      "Fetch first-level comments for a Reddit post and discover more.cursor values for replies.",
    zh_Hans: "获取 Reddit 帖子的一级评论，并发现用于回复分页的 more.cursor。",
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
          "Comment sort. Valid values: CONFIDENCE, NEW, TOP, HOT, CONTROVERSIAL, OLD, RANDOM.",
        zh_Hans:
          "评论排序。有效值：CONFIDENCE、NEW、TOP、HOT、CONTROVERSIAL、OLD、RANDOM。",
      },
    }),
    redditStringParameter({
      name: "after",
      default: "",
      displayName: { en_US: "After", zh_Hans: "分页 after" },
      hint: {
        en_US:
          "OpenAPI default empty. For next comments page, pass the returned after cursor unchanged.",
        zh_Hans: "OpenAPI 默认空字符串。翻页时原样传回响应中的 after cursor。",
      },
      llmDescription: {
        en_US:
          "Opaque comments pagination cursor. Do not parse, decode, or rewrite it.",
        zh_Hans: "不透明评论分页 cursor。不要解析、解码或改写。",
      },
    }),
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeRedditGet(endpoint, args, {
      post_id: readRedditPostId(p),
      sort_type: readOptionalStringParam(p, "sort_type") ?? "CONFIDENCE",
      after: readOptionalStringParam(p, "after"),
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
