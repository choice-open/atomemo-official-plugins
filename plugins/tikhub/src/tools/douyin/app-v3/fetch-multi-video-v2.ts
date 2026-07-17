import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_multi_video_v2",
  method: "POST",
  path: "/api/v1/douyin/app/v3/fetch_multi_video_v2",
}

export const tikhub_douyin_fetch_multi_video_v2: ToolDefinition = {
  name: "tikhub_douyin_fetch_multi_video_v2",
  display_name: {
    en_US: "Douyin · Batch Get Videos V2",
    zh_Hans: "抖音 · 批量获取视频信息V2",
  },
  description: {
    en_US: "Batch get Douyin video information V2. Returns video details for multiple video IDs.",
    zh_Hans: "批量获取抖音视频信息V2。通过多个视频ID返回作品详情。",
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
    const videoIdsStr = readRequiredStringParam(p, "video_ids")
    const videoIds = videoIdsStr.split(",").map((id) => id.trim()).filter(Boolean)
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      body: { video_ids: videoIds },
    })
  },
}
