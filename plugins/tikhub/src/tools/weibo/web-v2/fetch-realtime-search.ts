import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeiboGet,
  pageParameter,
  readOptionalIntegerParam,
  readOptionalStringParam,
  weiboStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_realtime_search",
  method: "GET",
  path: "/api/v1/weibo/web_v2/fetch_realtime_search",
}

export const tikhub_weibo_realtime_search: ToolDefinition = {
  name: "tikhub_weibo_realtime_search",
  display_name: {
    en_US: "Weibo · Realtime Search",
    zh_Hans: "微博 · 实时搜索",
  },
  description: {
    en_US:
      "Fetch the latest Weibo posts sorted by time for real-time monitoring and incident tracking.",
    zh_Hans: "按时间获取最新微博，用于实时舆情、新增内容和突发事件监测。",
  },
  icon: "🔎",
  parameters: [
    credentialParameter,
    weiboStringParameter({
      name: "query",
      required: true,
      displayName: { en_US: "Keyword", zh_Hans: "关键词" },
      hint: {
        en_US: "Required keyword for realtime Weibo search.",
        zh_Hans: "实时微博搜索的必填关键词。",
      },
      llmDescription: {
        en_US: "Required keyword used to fetch latest Weibo search results.",
        zh_Hans: "用于获取最新微博搜索结果的必填关键词。",
      },
      placeholder: { en_US: "brand name", zh_Hans: "品牌名" },
    }),
    pageParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeiboGet(endpoint, args, {
      query: readOptionalStringParam(p, "query"),
      page: readOptionalIntegerParam(p, "page") ?? "1",
    })
  },
}
