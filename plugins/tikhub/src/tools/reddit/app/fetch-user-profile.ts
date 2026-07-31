import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeRedditGet,
  needFormatParameter,
  readOptionalBooleanParam,
  readUsername,
  redditStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "reddit_app_fetch_user_profile",
  method: "GET",
  path: "/api/v1/reddit/app/fetch_user_profile",
}

export const tikhub_reddit_user_profile: ToolDefinition = {
  name: "tikhub_reddit_user_profile",
  display_name: {
    en_US: "Reddit · Get User Profile",
    zh_Hans: "Reddit · 获取用户资料",
  },
  description: {
    en_US:
      "Fetch Reddit user profile data such as account age, karma, bio, verification, and badges.",
    zh_Hans: "获取 Reddit 用户资料，包括账号时间、Karma、简介、认证和徽章等。",
  },
  icon: "👽",
  parameters: [
    credentialParameter,
    redditStringParameter({
      name: "username",
      required: true,
      displayName: { en_US: "Username", zh_Hans: "用户名" },
      hint: {
        en_US: "Required Reddit username without u/.",
        zh_Hans: "必填 Reddit 用户名，不带 u/ 前缀。",
      },
      llmDescription: {
        en_US: "Reddit username without the u/ prefix.",
        zh_Hans: "Reddit 用户名，不带 u/ 前缀。",
      },
      placeholder: { en_US: "spez", zh_Hans: "spez" },
    }),
    needFormatParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeRedditGet(endpoint, args, {
      username: readUsername(p),
      need_format: String(readOptionalBooleanParam(p, "need_format") ?? false),
    })
  },
}
