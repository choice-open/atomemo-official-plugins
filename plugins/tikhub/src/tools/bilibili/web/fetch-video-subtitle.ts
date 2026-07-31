import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bilibiliStringParameter,
  credentialParameter,
  invokeBilibiliGet,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_video_subtitle",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_video_subtitle",
}

export const tikhub_bilibili_video_subtitles: ToolDefinition = {
  name: "tikhub_bilibili_video_subtitles",
  display_name: {
    en_US: "Bilibili · Video Subtitles",
    zh_Hans: "哔哩哔哩 · 视频字幕",
  },
  description: {
    en_US: "Fetch subtitle information for a known Bilibili video part.",
    zh_Hans: "获取已知 Bilibili 视频分 P 的字幕信息。",
  },
  icon: "📺",
  parameters: [
    credentialParameter,
    bilibiliStringParameter({
      name: "a_id",
      required: true,
      displayName: { en_US: "AID", zh_Hans: "视频 a_id" },
      hint: {
        en_US: "Required video a_id from video details. Keep it as a string.",
        zh_Hans: "必填视频 a_id，通常来自视频详情响应。按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Bilibili video a_id. Treat it as a string and never convert it to a number.",
        zh_Hans: "必填 Bilibili 视频 a_id。按字符串处理，不要转成 number。",
      },
      placeholder: { en_US: "114006081739452", zh_Hans: "114006081739452" },
    }),
    bilibiliStringParameter({
      name: "c_id",
      required: true,
      displayName: { en_US: "CID", zh_Hans: "视频 c_id" },
      hint: {
        en_US:
          "Required video c_id from video details or parts. Keep it as a string.",
        zh_Hans: "必填视频 c_id，通常来自视频详情或分 P 信息。按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Bilibili video c_id. Treat it as a string and never convert it to a number.",
        zh_Hans: "必填 Bilibili 视频 c_id。按字符串处理，不要转成 number。",
      },
      placeholder: { en_US: "28400484458", zh_Hans: "28400484458" },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      a_id: readTrimmedRequired(p, "a_id", "a_id"),
      c_id: readTrimmedRequired(p, "c_id", "c_id"),
    })
  },
}
