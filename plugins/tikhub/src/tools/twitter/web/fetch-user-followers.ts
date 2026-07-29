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
  id: "fetch_user_followers",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_user_followers",
}

export const tikhub_twitter_user_followers: ToolDefinition = {
  name: "tikhub_twitter_user_followers",
  display_name: {
    en_US: "Twitter · User Followers",
    zh_Hans: "Twitter · 用户粉丝",
  },
  description: {
    en_US:
      "Get followers of an X/Twitter account for audience and prospect discovery.",
    zh_Hans: "获取指定账号粉丝列表，用于竞品受众和潜客发现。",
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
