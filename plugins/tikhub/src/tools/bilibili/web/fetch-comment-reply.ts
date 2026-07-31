import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  bilibiliIntegerParameter,
  bilibiliStringParameter,
  bvIdParameter,
  credentialParameter,
  invokeBilibiliGet,
  readPageNumber,
  readTrimmedRequired,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "bilibili_web_fetch_comment_reply",
  method: "GET",
  path: "/api/v1/bilibili/web/fetch_comment_reply",
}

export const tikhub_bilibili_comment_replies: ToolDefinition = {
  name: "tikhub_bilibili_comment_replies",
  display_name: {
    en_US: "Bilibili · Comment Replies",
    zh_Hans: "哔哩哔哩 · 评论回复",
  },
  description: {
    en_US: "Fetch replies under a specific Bilibili video comment.",
    zh_Hans: "获取 Bilibili 视频下指定评论的回复。",
  },
  icon: "📺",
  parameters: [
    credentialParameter,
    bvIdParameter,
    bilibiliStringParameter({
      name: "rpid",
      required: true,
      displayName: { en_US: "Reply ID", zh_Hans: "评论 rpid" },
      hint: {
        en_US: "Required parent comment rpid. Keep it as a string.",
        zh_Hans: "必填父评论 rpid。按字符串保留。",
      },
      llmDescription: {
        en_US:
          "Required Bilibili comment rpid. Treat it as a string and never convert long IDs to JavaScript numbers.",
        zh_Hans:
          "必填 Bilibili 评论 rpid。按字符串处理，不要把长 ID 转成 JavaScript number。",
      },
      placeholder: { en_US: "237109455120", zh_Hans: "237109455120" },
    }),
    bilibiliIntegerParameter({
      name: "pn",
      default: 1,
      minimum: 1,
      displayName: { en_US: "Page Number", zh_Hans: "页码" },
      hint: {
        en_US: "OpenAPI default 1.",
        zh_Hans: "OpenAPI 默认 1。",
      },
      llmDescription: {
        en_US: "Reply page number. OpenAPI default is 1.",
        zh_Hans: "评论回复页码。OpenAPI 默认 1。",
      },
    }),
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeBilibiliGet(endpoint, args, {
      bv_id: readTrimmedRequired(p, "bv_id", "bv_id"),
      pn: String(readPageNumber(p)),
      rpid: readTrimmedRequired(p, "rpid", "rpid"),
    })
  },
}
