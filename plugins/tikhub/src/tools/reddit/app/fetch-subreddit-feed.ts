import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readOptionalStringParam,
  readSubredditName,
  redditSelectParameter,
  redditStringParameter,
  subredditFeedSortValues,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_subreddit_feed",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_subreddit_feed",
}

export const tikhub_reddit_subreddit_feed: ToolDefinition = {
  name: "tikhub_reddit_subreddit_feed",
  display_name: {
    en_US: "Reddit · Get Subreddit Feed",
    zh_Hans: "Reddit · 获取社区帖子 Feed",
  },
  description: {
    en_US:
      "Fetch posts from a subreddit feed for community and topic analysis.",
    zh_Hans: "获取指定 Subreddit 的帖子 Feed，用于社区和话题分析。",
  },
  icon: "👽",
  parameters: [
    credentialParameter,
    redditStringParameter({
      name: "subreddit_name",
      required: true,
      displayName: { en_US: "Subreddit Name", zh_Hans: "Subreddit 名称" },
      hint: {
        en_US: "Required subreddit name without r/.",
        zh_Hans: "必填 subreddit 名称，不带 r/ 前缀。",
      },
      llmDescription: {
        en_US: "Subreddit name without the r/ prefix.",
        zh_Hans: "Subreddit 名称，不带 r/ 前缀。",
      },
      placeholder: { en_US: "startups", zh_Hans: "startups" },
    }),
    redditSelectParameter({
      name: "sort",
      values: subredditFeedSortValues,
      default: "BEST",
      displayName: { en_US: "Sort", zh_Hans: "排序" },
      hint: {
        en_US: "OpenAPI default BEST.",
        zh_Hans: "OpenAPI 默认 BEST。",
      },
      llmDescription: {
        en_US:
          "Subreddit feed sort. Valid values: BEST, HOT, NEW, TOP, CONTROVERSIAL, RISING.",
        zh_Hans:
          "社区 Feed 排序。有效值：BEST、HOT、NEW、TOP、CONTROVERSIAL、RISING。",
      },
    }),
    redditStringParameter({
      name: "after",
      default: "",
      displayName: { en_US: "After", zh_Hans: "分页 after" },
      hint: {
        en_US:
          "OpenAPI default empty. For pagination, pass the returned after cursor unchanged.",
        zh_Hans: "OpenAPI 默认空字符串。翻页时原样传回响应中的 after cursor。",
      },
      llmDescription: {
        en_US: "Opaque pagination cursor. Do not parse, decode, or rewrite it.",
        zh_Hans: "不透明分页 cursor。不要解析、解码或改写。",
      },
    }),
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeRedditGet(endpoint, args, {
      subreddit_name: readSubredditName(p, { required: true }),
      sort: readOptionalStringParam(p, "sort") ?? "BEST",
      after: readOptionalStringParam(p, "after"),
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
