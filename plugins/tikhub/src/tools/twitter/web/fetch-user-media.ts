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
  id: "fetch_user_media",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_user_media",
}

export const tikhub_twitter_user_media: ToolDefinition = {
  name: "tikhub_twitter_user_media",
  display_name: {
    en_US: "Twitter · User Media",
    zh_Hans: "Twitter · 用户媒体",
  },
  description: {
    en_US:
      "Get media posts from a user for creative and content strategy analysis.",
    zh_Hans: "获取指定用户发布的媒体内容，用于素材和内容策略分析。",
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
