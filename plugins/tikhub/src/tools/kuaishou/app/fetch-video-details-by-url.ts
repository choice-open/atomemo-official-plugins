import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouStringParameter,
  readRequiredString,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_one_video_by_url",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_one_video_by_url",
}

export const tikhub_kuaishou_video_details_by_url: ToolDefinition = {
  name: "tikhub_kuaishou_video_details_by_url",
  display_name: {
    en_US: "Kuaishou · Video Details by URL",
    zh_Hans: "快手 · 分享链接作品详情",
  },
  description: {
    en_US:
      "Fetch metadata for a Kuaishou post from its URL or complete share text without downloading media.",
    zh_Hans: "通过快手作品 URL 或完整分享文本获取元数据，不下载媒体。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "share_text",
      required: true,
      displayName: { en_US: "Share Text", zh_Hans: "分享文本" },
      hint: {
        en_US:
          "Required Kuaishou post URL or complete share text containing the URL.",
        zh_Hans: "必填快手作品 URL，或包含 URL 的完整分享文本。",
      },
      llmDescription: {
        en_US:
          "Required post URL or share text. Do not use this tool to download media.",
        zh_Hans: "必填作品 URL 或分享文本。此工具不下载媒体。",
      },
      placeholder: {
        en_US: "https://v.kuaishou.com/cNYP0Z",
        zh_Hans: "https://v.kuaishou.com/cNYP0Z",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      share_text: readRequiredString(p, "share_text"),
    })
  },
}
