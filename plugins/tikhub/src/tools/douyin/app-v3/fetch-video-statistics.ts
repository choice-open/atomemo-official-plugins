import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_video_statistics",
  method: "GET",
  path: "/api/v1/douyin/app/v3/fetch_video_statistics",
}

export const tikhub_douyin_fetch_video_statistics: ToolDefinition = {
  name: "tikhub_douyin_fetch_video_statistics",
  display_name: {
    en_US: "Douyin · Get Video Statistics",
    zh_Hans: "抖音 · 根据视频ID获取作品的统计数据",
  },
  description: {
    en_US: "Get Douyin video statistics by video ID. Returns like count, download count, play count, share count, etc.",
    zh_Hans: "根据视频ID获取抖音作品的统计数据，包括点赞数、下载数、播放数、分享数等。",
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
      name: "aweme_id",
      type: "string",
      required: true,
      display_name: { en_US: "Video ID", zh_Hans: "视频ID" },
      ai: {
        llm_description: {
          en_US: "Douyin video/aweme ID. Can be extracted from the video share URL.",
          zh_Hans: "抖音作品/视频ID，可从视频分享链接中提取。",
        },
      },
      ui: { hint: { en_US: "Douyin video ID (aweme_id).", zh_Hans: "抖音作品ID。" }, support_expression: true, component: "input", placeholder: { en_US: "Video ID", zh_Hans: "视频ID" }, width: "full" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const awemeId = readRequiredStringParam(p, "aweme_id")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: { aweme_id: awemeId },
    })
  },
}
