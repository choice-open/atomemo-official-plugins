import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeBilibiliGet,
  readTrimmedRequired,
  uidParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_user_relation_stat",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_user_relation_stat",
}

export const tikhub_bilibili_user_relation_stats: ToolDefinition = {
  name: "tikhub_bilibili_user_relation_stats",
  display_name: {
    en_US: "Bilibili · User Relation Stats",
    zh_Hans: "哔哩哔哩 · 用户关注粉丝统计",
  },
  description: {
    en_US: "Fetch following and follower counts for a Bilibili user.",
    zh_Hans: "获取 Bilibili 用户关注数和粉丝数。",
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
