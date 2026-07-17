import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_one_video_v3",
  method: "GET",
  path: "/api/v1/douyin/app/v3/fetch_one_video_v3",
}

export const tikhub_douyin_fetch_one_video_v3: ToolDefinition = {
  name: "tikhub_douyin_fetch_one_video_v3",
  display_name: {
    en_US: "Douyin · Get Single Video V3",
    zh_Hans: "抖音 · 获取单个作品数据V3",
  },
  description: {
    en_US: "Get single Douyin video data V3 (no copyright restrictions). Returns video details by aweme ID.",
    zh_Hans: "获取抖音单个作品数据V3（无版权限制）。通过视频ID返回作品详情。",
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
      ui: { hint: { en_US: "Douyin video ID (aweme_id), e.g. 7339393672959757570.", zh_Hans: "抖音作品ID，如 7339393672959757570。" }, support_expression: true, component: "input", placeholder: { en_US: "Video ID", zh_Hans: "视频ID" }, width: "full" },
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
