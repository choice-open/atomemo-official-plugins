import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  rawParameter,
  readOptionalBooleanParam,
  readOptionalStringIdParam,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_channels_fetch_video_comments",
  method: "POST",
  path: "/api/v1/wechat_channels/v2/fetch_video_comments",
}

export const tikhub_wechat_channels_comments: ToolDefinition = {
  name: "tikhub_wechat_channels_comments",
  display_name: {
    en_US: "WeChat Channels · Get Video Comments",
    zh_Hans: "微信视频号 · 获取作品评论",
  },
  description: {
    en_US:
      "Get first-level comments or replies for a WeChat Channels video with last_buffer pagination.",
    zh_Hans: "获取视频号作品一级评论或指定评论回复，支持 last_buffer 翻页。",
  },
  icon: "💬",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "object_id",
      required: true,
      displayName: { en_US: "Object ID", zh_Hans: "作品 object_id" },
      hint: {
        en_US: "Required video objectId. Pass it as a string.",
        zh_Hans: "必填视频 objectId，必须按字符串传递。",
      },
      llmDescription: {
        en_US:
          "Required WeChat Channels object_id for comments. Treat as a string and never convert to Number.",
        zh_Hans:
          "评论接口必填视频号 object_id。必须按字符串处理，禁止转为 Number。",
      },
    }),
    wechatStringParameter({
      name: "last_buffer",
      default: "",
      displayName: { en_US: "Last Buffer", zh_Hans: "分页 last_buffer" },
      hint: {
        en_US:
          "Leave empty for the first page. Pass the returned last_buffer unchanged for pagination.",
        zh_Hans: "首次请求留空。翻页时原样传入上次响应返回的 last_buffer。",
      },
      llmDescription: {
        en_US:
          "Opaque comment pagination cursor. Pass it back exactly as returned; do not parse or rewrite.",
        zh_Hans: "评论不透明分页游标。必须原样传回，不要解析或改写。",
      },
    }),
    wechatStringParameter({
      name: "comment_id",
      default: "",
      displayName: { en_US: "Comment ID", zh_Hans: "评论 comment_id" },
      hint: {
        en_US:
          "Leave empty for first-level comments. Provide a commentId string to fetch replies.",
        zh_Hans: "留空获取一级评论。传入 commentId 字符串可展开回复。",
      },
      llmDescription: {
        en_US:
          "Optional comment_id. Empty returns first-level comments; a value fetches replies for that comment. Treat as a string.",
        zh_Hans:
          "可选 comment_id。为空获取一级评论；有值时获取该评论回复。按字符串处理。",
      },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    return invokeWeChatPost(endpoint, args, {
      object_id: readOptionalStringIdParam(p, "object_id"),
      last_buffer: readOptionalStringIdParam(p, "last_buffer") ?? "",
      comment_id: readOptionalStringIdParam(p, "comment_id") ?? "",
      raw: readOptionalBooleanParam(p, "raw") ?? true,
    })
  },
}
