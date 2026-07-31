import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_trending_searches",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_trending_searches",
}

export const tikhub_reddit_trending_searches: ToolDefinition = {
  name: "tikhub_reddit_trending_searches",
  display_name: {
    en_US: "Reddit · Trending Searches",
    zh_Hans: "Reddit · 热门搜索趋势",
  },
  description: {
    en_US: "Fetch current Reddit trending searches for topic discovery.",
    zh_Hans: "获取 Reddit 当前热门搜索，用于热点发现和关键词扩展。",
  },
  icon: "🔴",
  parameters: [credentialParameter, needFormatParameter],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeRedditGet(endpoint, args, {
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
