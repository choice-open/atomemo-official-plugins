import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  cursorParameter,
  invokeTwitterGet,
  readOptionalStringParam,
  readRequiredIdStringParam,
  tweetIdParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_retweet_user_list",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_retweet_user_list",
}

export const tikhub_twitter_retweet_users: ToolDefinition = {
  name: "tikhub_twitter_retweet_users",
  display_name: {
    en_US: "Twitter · Retweet Users",
    zh_Hans: "Twitter · 转推用户",
  },
  description: {
    en_US:
      "Get users who retweeted a tweet for propagation and influence analysis.",
    zh_Hans: "获取转推某条推文的用户，用于传播路径和影响力线索分析。",
  },
  icon: "🐦",
  parameters: [credentialParameter, tweetIdParameter, cursorParameter],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTwitterGet(endpoint, args, {
      tweet_id: readRequiredIdStringParam(p, "tweet_id"),
      cursor: readOptionalStringParam(p, "cursor"),
    })
  },
}
