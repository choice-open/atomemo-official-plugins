import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { readRequiredStringParam } from "../../../lib/request"
import { credentialParameter, invokeTikTokGet, stringParameter } from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_one_video_by_share_url_v2",
  method: "GET",
  path: "/api/v1/tiktok/app/v3/fetch_one_video_by_share_url_v2",
}

export const tikhub_tiktok_fetch_one_video_by_share_url_v2: ToolDefinition = {
  name: "tikhub_tiktok_fetch_one_video_by_share_url_v2",
  display_name: {
    en_US: "TikTok · Get Video by Share URL V2",
    zh_Hans: "TikTok · 根据分享链接获取单个作品数据V2",
  },
  description: {
    en_US: "Get single TikTok video data by sharing link V2.",
    zh_Hans: "根据分享链接获取 TikTok 单个作品数据V2。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    stringParameter({
      name: "share_url",
      required: true,
      displayName: { en_US: "Share URL", zh_Hans: "分享链接" },
      description: {
        en_US: "TikTok video share URL.",
        zh_Hans: "TikTok 视频分享链接。",
      },
      hint: { en_US: "TikTok share URL.", zh_Hans: "TikTok 分享链接。" },
      placeholder: {
        en_US: "https://www.tiktok.com/...",
        zh_Hans: "https://www.tiktok.com/...",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeTikTokGet(endpoint, args, {
      share_url: readRequiredStringParam(p, "share_url"),
    })
  },
}
