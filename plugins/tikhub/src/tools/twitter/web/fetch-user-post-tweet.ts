import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  cursorParameter,
  invokeTwitterGet,
  readOptionalStringParam,
  readScreenNameOrRestId,
  restIdParameter,
  screenNameParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_user_post_tweet",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_user_post_tweet",
}

export const tikhub_twitter_user_posts: ToolDefinition = {
  name: "tikhub_twitter_user_posts",
  display_name: {
    en_US: "Twitter · User Posts",
    zh_Hans: "Twitter · 用户发帖",
  },
  description: {
    en_US:
      "Get historical tweets from a user for content strategy and posting cadence analysis.",
    zh_Hans: "获取指定用户历史推文，用于内容策略、账号观点和发布节奏分析。",
  },
  icon: "🐦",
  parameters: [
    credentialParameter,
    screenNameParameter(false),
    restIdParameter,
    cursorParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTwitterGet(endpoint, args, {
      ...readScreenNameOrRestId(p),
      cursor: readOptionalStringParam(p, "cursor"),
    })
  },
}
