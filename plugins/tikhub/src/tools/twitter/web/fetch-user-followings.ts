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
  id: "fetch_user_followings",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_user_followings",
}

export const tikhub_twitter_user_followings: ToolDefinition = {
  name: "tikhub_twitter_user_followings",
  display_name: {
    en_US: "Twitter · User Followings",
    zh_Hans: "Twitter · 用户关注",
  },
  description: {
    en_US:
      "Get accounts followed by a user for network, competitor ecosystem, and key account analysis.",
    zh_Hans: "获取指定账号关注列表，用于账号关系、竞品生态和行业关键账号分析。",
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
