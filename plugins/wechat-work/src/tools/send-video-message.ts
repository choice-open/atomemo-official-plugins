import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendVideoMessageSkill from "./send-video-message-skill.md" with {
  type: "text",
}

type SendMessageResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
  invaliduser?: string
  invalidparty?: string
  invalidtag?: string
}

export const sendVideoMessageTool: ToolDefinition = {
  name: "wechat-work-send-video",
  display_name: {
    en_US: "Send video message",
    zh_Hans: "发送视频消息",
  },
  description: {
    en_US: "Send a video message to members via a self-built application.",
    zh_Hans: "通过自建应用向成员发送视频消息。",
  },
  skill: sendVideoMessageSkill,
  icon: "🎬",
  parameters: [
    {
      name: "wechat_work_credential",
      type: "credential_id",
      required: true,
      credential_name: "wechat-work",
      display_name: {
        en_US: "WeChat Work credential",
        zh_Hans: "企业微信凭证",
      },
      ui: { component: "credential-select" },
    },
    {
      name: "agent_id",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Agent ID",
        zh_Hans: "应用 AgentId",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The numeric agent id of your self-built app",
          zh_Hans: "自建应用的 AgentId",
        },
      },
    },
    {
      name: "touser",
      type: "string",
      display_name: {
        en_US: "To users (userid)",
        zh_Hans: "接收成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pipe-separated userids, e.g., zhangsan|lisi",
          zh_Hans: "成员 userid，多个用 | 分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "toparty",
      type: "string",
      display_name: {
        en_US: "To departments (partyid)",
        zh_Hans: "接收部门 partyid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pipe-separated partyids, e.g., 1|2",
          zh_Hans: "部门 partyid，多个用 | 分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "totag",
      type: "string",
      display_name: {
        en_US: "To tags (tagid)",
        zh_Hans: "接收标签 tagid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pipe-separated tagids, e.g., 1|2",
          zh_Hans: "标签 tagid，多个用 | 分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "media_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Media ID",
        zh_Hans: "素材 media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID from media upload API (type=video)",
          zh_Hans: "通过素材上传接口获取的 media_id（类型为video）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      display_name: {
        en_US: "Title",
        zh_Hans: "视频标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Video title (max 64 characters)",
          zh_Hans: "视频标题，最多64个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "description",
      type: "string",
      display_name: {
        en_US: "Description",
        zh_Hans: "视频描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Video description (max 512 characters)",
          zh_Hans: "视频描述，最多512个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "safe",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Confidential message",
        zh_Hans: "保密消息",
      },
      ui: {
        component: "select",
        options: [
          { label: "No (可对外分享)", value: 0 },
          { label: "Yes (不能分享显示水印)", value: 1 },
        ],
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      agent_id?: number
      touser?: string
      toparty?: string
      totag?: string
      media_id?: string
      title?: string
      description?: string
      safe?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const touser = params.touser?.trim()
    const toparty = params.toparty?.trim()
    const totag = params.totag?.trim()
    const mediaId = params.media_id?.trim()
    if (!touser && !toparty && !totag) {
      throw new Error("At least one of touser, toparty, or totag is required.")
    }
    if (!mediaId) {
      throw new Error("media_id is required.")
    }
    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error(
        "Wechat work credential is missing or has no access_token.",
      )
    }

    const video: Record<string, string> = { media_id: mediaId }
    if (params.title?.trim()) {
      video.title = params.title.trim().slice(0, 64)
    }
    if (params.description?.trim()) {
      video.description = params.description.trim().slice(0, 512)
    }

    const data = await wechatWorkPostJson<SendMessageResponse>(
      "/message/send",
      token,
      {
        touser: touser || undefined,
        toparty: toparty || undefined,
        totag: totag || undefined,
        msgtype: "video",
        agentid: params.agent_id,
        video,
        ...(typeof params.safe === "number" ? { safe: params.safe } : {}),
      },
    )
    return {
      msgid: data.msgid ?? null,
      invaliduser: data.invaliduser ?? "",
      invalidparty: data.invalidparty ?? "",
      invalidtag: data.invalidtag ?? "",
    }
  },
}
