import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  instagramStringParameter,
  invokeInstagramGet,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "instagram_v1_fetch_user_info_by_username_v3",
  method: "GET",
  path: "/api/v1/instagram/v1/fetch_user_info_by_username_v3",
}

export const tikhub_instagram_user_profile: ToolDefinition = {
  name: "tikhub_instagram_user_profile",
  display_name: {
    en_US: "Instagram · User Profile",
    zh_Hans: "Instagram · 用户资料",
  },
  description: {
    en_US: "Fetch detailed Instagram user profile data by username.",
    zh_Hans: "按用户名获取 Instagram 用户详细资料。",
  },
  icon: "📸",
  parameters: [
    credentialParameter,
    instagramStringParameter({
      name: "username",
      required: true,
      displayName: { en_US: "Username", zh_Hans: "用户名" },
      hint: {
        en_US: "Required Instagram username without @.",
        zh_Hans: "必填 Instagram 用户名，不带 @。",
      },
      llmDescription: {
        en_US:
          "Required Instagram username. Do not include @. This endpoint is in the Instagram-V1-API group even though its name contains v3.",
        zh_Hans:
          "必填 Instagram 用户名，不带 @。该接口名称含 v3，但属于 Instagram-V1-API 分组。",
      },
      placeholder: { en_US: "instagram", zh_Hans: "instagram" },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeInstagramGet(endpoint, args, {
      username: readTrimmedRequired(p, "username", "username"),
    })
  },
}
