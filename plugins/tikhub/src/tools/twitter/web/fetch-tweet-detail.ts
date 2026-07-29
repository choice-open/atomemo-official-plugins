import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeTwitterGet,
  readRequiredIdStringParam,
  tweetIdParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_tweet_detail",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_tweet_detail",
}

export const tikhub_twitter_tweet_detail: ToolDefinition = {
  name: "tikhub_twitter_tweet_detail",
  display_name: {
    en_US: "Twitter · Tweet Detail",
    zh_Hans: "Twitter · 推文详情",
  },
  description: {
    en_US:
      "Get full tweet details including author, content, media, time, and engagement stats.",
    zh_Hans: "获取完整推文详情，包括作者、正文、媒体、发布时间和互动统计。",
  },
  icon: "🐦",
  parameters: [credentialParameter, tweetIdParameter],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTwitterGet(endpoint, args, {
      tweet_id: readRequiredIdStringParam(p, "tweet_id"),
    })
  },
}
