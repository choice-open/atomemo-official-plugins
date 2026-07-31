import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  groupIdParameter,
  invokeToutiaoGet,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "toutiao_app_get_video_info",
  method: "GET",
  path: "/api/v1/toutiao/app/get_video_info",
}

export const tikhub_toutiao_video_info: ToolDefinition = {
  name: "tikhub_toutiao_video_info",
  display_name: {
    en_US: "Toutiao · Video Info",
    zh_Hans: "今日头条 · 视频信息",
  },
  description: {
    en_US:
      "Fetch metadata for a known Toutiao video post without downloading media.",
    zh_Hans: "获取已知今日头条视频作品元数据，不下载媒体文件。",
  },
  icon: "📰",
  parameters: [credentialParameter, groupIdParameter("video")],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeToutiaoGet(endpoint, args, {
      group_id: readTrimmedRequired(p, "group_id", "group_id"),
    })
  },
}
