import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeKuaishouGet,
  kuaishouStringParameter,
  readRequiredString,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "kuaishou_app_fetch_one_video",
  method: "GET",
  path: "/api/v1/kuaishou/app/fetch_one_video",
}

export const tikhub_kuaishou_video_details: ToolDefinition = {
  name: "tikhub_kuaishou_video_details",
  display_name: {
    en_US: "Kuaishou · Video Details",
    zh_Hans: "快手 · 作品详情",
  },
  description: {
    en_US:
      "Fetch Kuaishou post metadata by photoId without downloading or playing media.",
    zh_Hans: "通过 photoId 获取快手作品元数据，不下载或播放媒体。",
  },
  icon: "🎬",
  parameters: [
    credentialParameter,
    kuaishouStringParameter({
      name: "photo_id",
      required: true,
      displayName: { en_US: "Photo ID", zh_Hans: "作品 ID" },
      hint: {
        en_US:
          "Required numeric photoId or short eID. For search results, use photoId from feed.share_info, not stream or media IDs.",
        zh_Hans:
          "必填数字 photoId 或短字符串 eID。搜索结果应使用 feed.share_info 中的 photoId，不要使用码流或媒体 ID。",
      },
      llmDescription: {
        en_US:
          "Required Kuaishou photoId. From video search, extract the photoId query value in data.data.mixFeeds[].feed.share_info, for example 3xus5bdgm6wmzyk. Do not use streamManifest.videoId, stream comment videoId, refer_photo_id, or media URLs. Keep it as a string.",
        zh_Hans:
          "必填快手 photoId。视频搜索后，从 data.data.mixFeeds[].feed.share_info 提取 photoId 参数值，例如 3xus5bdgm6wmzyk。不要使用 streamManifest.videoId、码流 comment 中的 videoId、refer_photo_id 或媒体 URL。按字符串保留。",
      },
      placeholder: {
        en_US: "3xus5bdgm6wmzyk",
        zh_Hans: "3xus5bdgm6wmzyk",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeKuaishouGet(endpoint, args, {
      photo_id: readRequiredString(p, "photo_id"),
    })
  },
}
