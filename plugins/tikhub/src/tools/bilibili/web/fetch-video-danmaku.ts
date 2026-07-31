import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bilibiliStringParameter,
  credentialParameter,
  invokeBilibiliGet,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_video_danmaku",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_video_danmaku",
}

export const tikhub_bilibili_video_danmaku: ToolDefinition = {
  name: "tikhub_bilibili_video_danmaku",
  display_name: {
    en_US: "Bilibili · Video Danmaku",
    zh_Hans: "哔哩哔哩 · 视频弹幕",
  },
  description: {
    en_US: "Fetch real-time danmaku for a known Bilibili video cid.",
    zh_Hans: "通过 Bilibili 视频 cid 获取实时弹幕。",
  },
  icon: "📺",
  parameters: [
    credentialParameter,
    bilibiliStringParameter({
      name: "cid",
      required: true,
      displayName: { en_US: "CID", zh_Hans: "视频 cid" },
      hint: {
        en_US:
          "Required video cid from video details or parts. Keep it as a string.",
        zh_Hans: "必填视频 cid，通常来自视频详情或分 P 信息。按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Bilibili video cid. Treat it as a string and never convert it to a number.",
        zh_Hans: "必填 Bilibili 视频 cid。按字符串处理，不要转成 number。",
      },
      placeholder: { en_US: "1639235405", zh_Hans: "1639235405" },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      cid: readTrimmedRequired(p, "cid", "cid"),
    })
  },
}
