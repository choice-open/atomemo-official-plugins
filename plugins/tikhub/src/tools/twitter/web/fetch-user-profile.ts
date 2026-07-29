import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeTwitterGet,
  readScreenNameOrRestId,
  restIdParameter,
  screenNameParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_user_profile",
  method: "GET",
  path: "/api/v1/twitter/web/fetch_user_profile",
}

export const tikhub_twitter_user_profile: ToolDefinition = {
  name: "tikhub_twitter_user_profile",
  display_name: {
    en_US: "Twitter · User Profile",
    zh_Hans: "Twitter · 用户资料",
  },
  description: {
    en_US: "Get an X/Twitter user profile by screen name or numeric user ID.",
    zh_Hans: "通过用户名或数字用户 ID 获取 X/Twitter 用户资料。",
  },
  icon: "🐦",
  parameters: [
    credentialParameter,
    screenNameParameter(false),
    restIdParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTwitterGet(endpoint, args, readScreenNameOrRestId(p))
  },
}
