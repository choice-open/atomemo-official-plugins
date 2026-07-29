import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { credentialParameter, invokeWeiboGet } from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_hot_search_summary",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_hot_search_summary",
}

export const tikhub_weibo_hot_search_summary: ToolDefinition = {
  name: "tikhub_weibo_hot_search_summary",
  display_name: {
    en_US: "Weibo · Hot Search Summary",
    zh_Hans: "微博 · 完整热搜榜",
  },
  description: {
    en_US:
      "Fetch the complete Weibo hot search ranking, currently about 50 items, for topic discovery.",
    zh_Hans: "获取微博完整热搜榜单，当前约 50 条，用于热点发现和监测词扩展。",
  },
  icon: "📈",
  parameters: [credentialParameter],
  invoke: async ({ args }) => invokeWeiboGet(endpoint, args, {}),
}
