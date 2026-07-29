import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import {
  credentialParameter,
  cursorParameter,
  invokeTwitterGet,
  readOptionalStringParam,
  screenNameParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_user_tweet_replies",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_user_tweet_replies",
}

export const tikhub_twitter_user_replies: ToolDefinition = {
  name: "tikhub_twitter_user_replies",
  display_name: {
    en_US: "Twitter · User Replies",
    zh_Hans: "Twitter · 用户发表的回复",
  },
  description: {
    en_US:
      "Get replies posted by a user, not second-level replies under one comment.",
    zh_Hans: "获取指定用户发表过的推文回复，不是某条评论的二级回复。",
  },
  icon: "🐦",
  parameters: [credentialParameter, screenNameParameter(true), cursorParameter],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTwitterGet(endpoint, args, {
      screen_name: readRequiredStringParam(p, "screen_name"),
      cursor: readOptionalStringParam(p, "cursor"),
    })
  },
}
