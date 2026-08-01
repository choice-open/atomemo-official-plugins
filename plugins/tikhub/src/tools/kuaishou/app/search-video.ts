import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouStringParameter,
  pcursorParameter,
  readOpaqueCursor,
  readRequiredString,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_search_video_v2",
  method: "GET",
  path: "/api/v1/kuaishou/app/search_video_v2",
}

export const tikhub_kuaishou_video_search: ToolDefinition = {
  name: "tikhub_kuaishou_video_search",
  display_name: {
    en_US: "Kuaishou · Video Search",
    zh_Hans: "快手 · 视频搜索",
  },
  description: {
    en_US:
      "Search Kuaishou videos with the more stable V2 endpoint. This endpoint is higher-priced; check the latest price in the TikHub dashboard.",
    zh_Hans:
      "使用稳定性更好的 V2 接口搜索快手视频。该接口价格较高，请查看 TikHub 后台最新价格。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "keyword",
      required: true,
      displayName: { en_US: "Keyword", zh_Hans: "关键词" },
      hint: {
        en_US:
          "Required keyword. This stable V2 endpoint is higher-priced; check the TikHub dashboard.",
        zh_Hans:
          "必填关键词。稳定版 V2 接口价格较高，请查看 TikHub 后台最新价格。",
      },
      llmDescription: {
        en_US: "Required keyword for stable Kuaishou video search.",
        zh_Hans: "快手稳定版视频搜索的必填关键词。",
      },
      placeholder: { en_US: "Artificial intelligence", zh_Hans: "人工智能" },
    }),
    pcursorParameter(),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      keyword: readRequiredString(p, "keyword"),
      pcursor: readOpaqueCursor(p),
    })
  },
}
