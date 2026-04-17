import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import setMeetingBackgroundSkill from "./set-meeting-background-skill.md" with { type: "text" }

type SetMeetingBackgroundResponse = {
  errcode?: number
  errmsg?: string
}

export const setMeetingBackgroundTool: ToolDefinition = {
  name: "wechat-work-set-meeting-background",
  display_name: {
    en_US: "Set meeting background",
    zh_Hans: "设置会议背景",
  },
  description: {
    en_US: "Set a custom background for a meeting.",
    zh_Hans: "设置会议背景图片。",
  },
  skill: setMeetingBackgroundSkill,
  icon: "🖼️",
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
      name: "meeting_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Meeting ID",
        zh_Hans: "会议ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting ID to set background",
          zh_Hans: "要设置背景的会议ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "background_media_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Background media ID",
        zh_Hans: "背景图片media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID of the background image",
          zh_Hans: "背景图片的media_id",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "background_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Background type",
        zh_Hans: "背景类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Type of background",
          zh_Hans: "背景类型",
        },
        options: [
          { label: "Global background (0)", value: "0" },
          { label: "Waiting room background (1)", value: "1" },
        ],
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      meeting_id?: string
      background_media_id?: string
      background_type?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const meetingId = params.meeting_id?.trim()
    if (!meetingId) {
      throw new Error("meeting_id is required.")
    }

    const backgroundMediaId = params.background_media_id?.trim()
    if (!backgroundMediaId) {
      throw new Error("background_media_id is required.")
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

    const body: Record<string, unknown> = {
      meeting_id: meetingId,
      background_media_id: backgroundMediaId,
    }

    const backgroundType = params.background_type?.trim()
    if (backgroundType) body.background_type = parseInt(backgroundType, 10)

    const data = await wechatWorkPostJson<SetMeetingBackgroundResponse>(
      "/meeting/background/set",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
