import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { TikHubApiEndpoint } from "../../../lib/request"
import {
  credentialParameter,
  invokeWeChatPost,
  readOptionalBooleanParam,
  readOptionalStringIdParam,
  wechatBooleanParameter,
  wechatStringParameter,
} from "../shared"

const endpoint: TikHubApiEndpoint = {
  id: "wechat_channels_fetch_channel_id_to_username",
  method: "POST",
  path: "/api/v1/wechat_channels/v2/fetch_channel_id_to_username",
}

const channelIdPattern = /^sph[A-Za-z0-9_-]+$/

const rawParameter = wechatBooleanParameter({
  name: "raw",
  default: false,
  displayName: { en_US: "Raw Response", zh_Hans: "原始响应" },
  hint: {
    en_US:
      "Live OpenAPI schema.default is false, although the description text is ambiguous. Keep false for the simplified username mapping.",
    zh_Hans:
      "实时 OpenAPI schema.default 为 false，虽然描述文本存在歧义。保持 false 可获取精简 username 映射。",
  },
  llmDescription: {
    en_US:
      "Whether TikHub should return the raw upstream response. For this endpoint, the live OpenAPI schema.default is false; use raw=false to read data.username, data.channel_id, data.nickname, and data.desc.",
    zh_Hans:
      "是否返回 TikHub 原始上游响应。此接口实时 OpenAPI schema.default 为 false；raw=false 时主要读取 data.username、data.channel_id、data.nickname 和 data.desc。",
  },
})

function readChannelId(params: Record<string, unknown>): string {
  const channelId = readOptionalStringIdParam(params, "channel_id")
  if (!channelId) {
    throw new Error(
      "channel_id is required. Enter the WeChat Channels ID visible in WeChat UI, starting with sph.",
    )
  }
  if (channelId.length > 64) {
    throw new Error(
      "channel_id must be at most 64 characters. Enter the WeChat Channels ID visible in WeChat UI, starting with sph.",
    )
  }
  if (!channelIdPattern.test(channelId)) {
    throw new Error(
      "Invalid channel_id. Enter the WeChat Channels ID visible in WeChat UI, starting with sph and containing only letters, numbers, underscores, or hyphens.",
    )
  }
  return channelId
}

export const tikhub_wechat_channels_resolve_username: ToolDefinition = {
  name: "tikhub_wechat_channels_resolve_username",
  display_name: {
    en_US: "WeChat Channels · Resolve Finder Username",
    zh_Hans: "微信视频号 · 解析账号 Username",
  },
  description: {
    en_US:
      "Convert a visible WeChat Channels ID such as sph... into the finder username required by profile and user-video tools.",
    zh_Hans:
      "将微信界面可见的 sph... 视频号 ID 转换为资料和作品列表工具需要的 finder username。",
  },
  icon: "👤",
  parameters: [
    credentialParameter,
    wechatStringParameter({
      name: "channel_id",
      required: true,
      maxLength: 64,
      pattern: "^sph[A-Za-z0-9_-]+$",
      displayName: { en_US: "Channel ID", zh_Hans: "视频号 ID" },
      hint: {
        en_US:
          "Required WeChat Channels ID visible in WeChat UI. Must start with sph and be at most 64 characters.",
        zh_Hans:
          "必填微信界面可见的视频号 ID。必须以 sph 开头，最多 64 个字符。",
      },
      llmDescription: {
        en_US:
          "Visible WeChat Channels ID, for example sphi9BjV8GK0Zsl. It must match ^sph[A-Za-z0-9_-]+$ and should be resolved before calling user profile or user videos.",
        zh_Hans:
          "微信界面可见的视频号 ID，例如 sphi9BjV8GK0Zsl。必须匹配 ^sph[A-Za-z0-9_-]+$，用于先解析出 user profile/user videos 需要的 finder username。",
      },
      placeholder: { en_US: "sphi9BjV8GK0Zsl", zh_Hans: "sphi9BjV8GK0Zsl" },
    }),
    rawParameter,
  ],
  invoke: async ({ args }) => {
    const p = (args.parameters ?? {}) as Record<string, unknown>
    const channelId = readChannelId(p)
    return invokeWeChatPost(endpoint, args, {
      channel_id: channelId,
      raw: readOptionalBooleanParam(p, "raw") ?? false,
    })
  },
}
