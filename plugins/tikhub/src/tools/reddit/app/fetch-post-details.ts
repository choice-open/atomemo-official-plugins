import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readRedditCommentId,
  readRedditPostId,
  redditBooleanParameter,
  redditStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_post_details",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_post_details",
}

export const tikhub_reddit_post_details: ToolDefinition = {
  name: "tikhub_reddit_post_details",
  display_name: {
    en_US: "Reddit · Get Post Details",
    zh_Hans: "Reddit · 获取帖子详情",
  },
  description: {
    en_US:
      "Fetch title, body, author, subreddit, media metadata, and engagement stats for one Reddit post.",
    zh_Hans:
      "获取单个 Reddit 帖子的标题、正文、作者、社区、媒体元数据和互动统计。",
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
          "Reddit post fullname. It must be a string and include the t3_ prefix; never convert it to a number.",
        zh_Hans:
          "Reddit 帖子 fullname。必须是字符串并保留 t3_ 前缀；不要转成数字。",
      },
      placeholder: { en_US: "t3_abc123", zh_Hans: "t3_abc123" },
    }),
    redditBooleanParameter({
      name: "include_comment_id",
      default: false,
      displayName: { en_US: "Include Comment ID", zh_Hans: "包含指定评论 ID" },
      hint: {
        en_US:
          "OpenAPI default false. Turn on only when fetching around a specific comment.",
        zh_Hans: "OpenAPI 默认 false。只在需要指定评论上下文时打开。",
      },
      llmDescription: {
        en_US:
          "Whether to include a specific comment ID. If true, comment_id is required and must include t1_.",
        zh_Hans:
          "是否包含指定评论 ID。为 true 时 comment_id 必填且必须包含 t1_。",
      },
    }),
    redditStringParameter({
      name: "comment_id",
      default: "",
      pattern: "^t1_.+",
      displayName: { en_US: "Comment ID", zh_Hans: "评论 ID" },
      hint: {
        en_US:
          "OpenAPI default empty. Required only when Include Comment ID is on; keep the t1_ prefix.",
        zh_Hans:
          "OpenAPI 默认空字符串。仅打开包含评论 ID 时必填；保留 t1_ 前缀。",
      },
      llmDescription: {
        en_US:
          "Reddit comment fullname. Required when include_comment_id is true. Keep the t1_ prefix unchanged.",
        zh_Hans:
          "Reddit 评论 fullname。include_comment_id 为 true 时必填，保留 t1_ 前缀。",
      },
      placeholder: { en_US: "t1_xyz789", zh_Hans: "t1_xyz789" },
    }),
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const includeCommentId =
      readOptionalBooleanParam(p, "include_comment_id") ?? false
    const commentId = readRedditCommentId(p)
    if (includeCommentId && !commentId) {
      throw new Error("comment_id is required when include_comment_id is true.")
    }
    return invokeRedditGet(endpoint, args, {
      post_id: readRedditPostId(p),
      include_comment_id: String(includeCommentId),
      comment_id: includeCommentId ? commentId : undefined,
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
