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
  id: "fetch_latest_post_comments",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_latest_post_comments",
}

export const tikhub_twitter_latest_comments: ToolDefinition = {
  name: "tikhub_twitter_latest_comments",
  display_name: {
    en_US: "Twitter · Latest Comments",
    zh_Hans: "Twitter · 最新评论",
  },
  description: {
    en_US: "Get the latest comments under a tweet for real-time monitoring.",
    zh_Hans: "获取推文下最新评论，用于实时舆情和新增评论监测。",
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
