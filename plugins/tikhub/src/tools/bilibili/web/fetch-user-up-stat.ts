import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeBilibiliGet,
  readTrimmedRequired,
  uidParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_user_up_stat",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_user_up_stat",
}

export const tikhub_bilibili_user_up_stats: ToolDefinition = {
  name: "tikhub_bilibili_user_up_stats",
  display_name: {
    en_US: "Bilibili · User UP Stats",
    zh_Hans: "哔哩哔哩 · UP 主播放获赞统计",
  },
  description: {
    en_US: "Fetch total video views and likes for a Bilibili UP creator.",
    zh_Hans: "获取 Bilibili UP 主总播放和总获赞统计。",
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
