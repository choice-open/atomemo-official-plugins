import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeBilibiliGet,
  readTrimmedRequired,
  uidParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_user_profile",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_user_profile",
}

export const tikhub_bilibili_user_profile: ToolDefinition = {
  name: "tikhub_bilibili_user_profile",
  display_name: {
    en_US: "Bilibili · User Profile",
    zh_Hans: "哔哩哔哩 · 用户资料",
  },
  description: {
    en_US: "Fetch Bilibili user profile information by UID.",
    zh_Hans: "通过 UID 获取 Bilibili 用户资料。",
  },
  icon: "📺",
  parameters: [credentialParameter, uidParameter],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      uid: readTrimmedRequired(p, "uid", "uid"),
    })
  },
}
