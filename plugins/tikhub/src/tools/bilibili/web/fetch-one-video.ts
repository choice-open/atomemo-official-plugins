import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bvIdParameter,
  credentialParameter,
  invokeBilibiliGet,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_one_video",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_one_video",
}

export const tikhub_bilibili_video_details: ToolDefinition = {
  name: "tikhub_bilibili_video_details",
  display_name: {
    en_US: "Bilibili · Video Details",
    zh_Hans: "哔哩哔哩 · 视频详情",
  },
  description: {
    en_US: "Fetch details for a known Bilibili video by BV ID.",
    zh_Hans: "通过 BV 号获取已知 Bilibili 视频详情。",
  },
  icon: "📺",
  parameters: [credentialParameter, bvIdParameter],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      bv_id: readTrimmedRequired(p, "bv_id", "bv_id"),
    })
  },
}
