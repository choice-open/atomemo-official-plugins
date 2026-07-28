import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import { invokeTikHubApi, readRequiredStringParam } from "../../../lib/request"
import {
  credentialParameter,
  readCredentialId,
  splitCommaSeparated,
  stringParameter,
} from "./shared"

const endpoint: TikHubApiEndpoint = {
  id: "fetch_multi_video_v2",
  method: "POST",
  path: "/api/v1/tiktok/app/v3/fetch_multi_video_v2",
}

export const tikhub_tiktok_fetch_multi_video_v2: ToolDefinition = {
  name: "tikhub_tiktok_fetch_multi_video_v2",
  display_name: {
    en_US: "TikTok · Batch Get Videos V2",
    zh_Hans: "TikTok · 批量获取视频信息V2",
  },
  description: {
    en_US:
      "Batch get TikTok video information V2. Sends a JSON array of video IDs.",
    zh_Hans: "批量获取 TikTok 视频信息V2。请求体为视频ID JSON 数组。",
  },
  icon: "🎵",
  parameters: [
    credentialParameter,
    stringParameter({
      name: "aweme_ids",
      required: true,
      displayName: { en_US: "Video IDs", zh_Hans: "视频ID列表" },
      description: {
        en_US: "Comma-separated list of TikTok video/aweme IDs.",
        zh_Hans: "TikTok 作品ID列表，多个ID用逗号分隔。",
      },
      hint: {
        en_US:
          "Comma-separated video IDs, e.g. 7339393672959757570,7339393672959757571.",
        zh_Hans:
          "视频ID列表，用逗号分隔，如 7339393672959757570,7339393672959757571。",
      },
      placeholder: { en_US: "id1,id2,id3", zh_Hans: "id1,id2,id3" },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const awemeIds = splitCommaSeparated(
      readRequiredStringParam(p, "aweme_ids"),
    )
    if (awemeIds.length === 0) {
      throw new Error("Missing required parameter: aweme_ids")
    }
    return invokeTikHubApi(endpoint, {
      credentials: args.credentials,
      credentialId: readCredentialId(p),
      body: awemeIds as unknown as Record<string, unknown>,
    })
  },
}
