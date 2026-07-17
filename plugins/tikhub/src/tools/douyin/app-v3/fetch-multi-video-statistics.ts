import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_multi_video_statistics",
  method: "GET",
  path: "/api/v1/douyin/app/v3/fetch_multi_video_statistics",
}

export const tikhub_douyin_fetch_multi_video_statistics: ToolDefinition = {
  name: "tikhub_douyin_fetch_multi_video_statistics",
  display_name: {
    en_US: "Douyin · Batch Get Video Statistics",
    zh_Hans: "抖音 · 根据视频ID批量获取作品的统计数据",
  },
  description: {
    en_US: "Batch get Douyin video statistics by multiple video IDs. Returns like count, download count, play count, share count for each video.",
    zh_Hans: "根据多个视频ID批量获取抖音作品的统计数据，包括每个视频的点赞数、下载数、播放数、分享数。",
  },
  icon: "🎬",
  parameters: [
    {
      name: "credential_id",
      type: "credential_id",
      required: true,
      credential_name: "tikhub-api-key",
      display_name: { en_US: "Credential", zh_Hans: "凭证" },
      ui: { component: "credential-select" },
    },
    {
      name: "video_ids",
      type: "string",
      required: true,
      display_name: { en_US: "Video IDs", zh_Hans: "视频ID列表" },
      ai: {
        llm_description: {
          en_US: "Comma-separated list of Douyin video/aweme IDs.",
          zh_Hans: "抖音作品ID列表，多个ID用逗号分隔。",
        },
      },
      ui: { hint: { en_US: "Comma-separated video IDs, e.g. 7339393672959757570,7339393672959757571.", zh_Hans: "视频ID列表，用逗号分隔，如 7339393672959757570,7339393672959757571。" }, support_expression: true, component: "input", placeholder: { en_US: "id1,id2,id3", zh_Hans: "id1,id2,id3" }, width: "full" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const videoIds = readRequiredStringParam(p, "video_ids")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: { video_ids: videoIds },
    })
  },
}
