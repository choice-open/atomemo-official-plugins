import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_one_video_by_share_url",
  method: "GET",
  path: "/api/v1/douyin/app/v3/fetch_one_video_by_share_url",
}

export const tikhub_douyin_fetch_one_video_by_share_url: ToolDefinition = {
  name: "tikhub_douyin_fetch_one_video_by_share_url",
  display_name: {
    en_US: "Douyin · Get Video by Share URL",
    zh_Hans: "抖音 · 根据分享链接获取单个作品数据",
  },
  description: {
    en_US: "Get single Douyin video data by sharing link. Returns video details from a share URL.",
    zh_Hans: "通过分享链接获取抖音单个作品数据。从分享URL返回作品详情。",
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
      name: "share_url",
      type: "string",
      required: true,
      display_name: { en_US: "Share URL", zh_Hans: "分享链接" },
      ai: {
        llm_description: {
          en_US: "Douyin video share URL, e.g. https://v.douyin.com/xxxxx/ or https://www.douyin.com/video/xxxxx.",
          zh_Hans: "抖音视频分享链接，如 https://v.douyin.com/xxxxx/ 或 https://www.douyin.com/video/xxxxx。",
        },
      },
      ui: { hint: { en_US: "Douyin share URL, e.g. https://v.douyin.com/xxxxx/.", zh_Hans: "抖音分享链接，如 https://v.douyin.com/xxxxx/。" }, support_expression: true, component: "input", placeholder: { en_US: "https://v.douyin.com/xxxxx/", zh_Hans: "https://v.douyin.com/xxxxx/" }, width: "full" },
    },
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const credentialId = readRequiredStringParam(p, "credential_id")
    const shareUrl = readRequiredStringParam(p, "share_url")
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId,
      queryParams: { share_url: shareUrl },
    })
  },
}
