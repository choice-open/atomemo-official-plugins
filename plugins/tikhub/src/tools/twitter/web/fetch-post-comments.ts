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
  id: "fetch_post_comments",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_post_comments",
}

export const tikhub_twitter_post_comments: ToolDefinition = {
  name: "tikhub_twitter_post_comments",
  display_name: {
    en_US: "Twitter · Post Comments",
    zh_Hans: "Twitter · 推文评论",
  },
  description: {
    en_US: "Get default or relevance-ordered comments under a tweet.",
    zh_Hans: "获取推文下默认或相关度较高排序的评论。",
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
