import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import updateMeetingSkill from "./update-meeting-skill.md" with { type: "text" }

type UpdateMeetingResponse = {
  errcode?: number
  errmsg?: string
}

export const updateMeetingTool: ToolDefinition = {
  name: "wechat-work-update-meeting",
  display_name: {
    en_US: "Update meeting",
    zh_Hans: "修改预约会议",
  },
  description: {
    en_US: "Update an existing meeting in WeChat Work.",
    zh_Hans: "修改企业微信中已有的预约会议。",
  },
  skill: updateMeetingSkill,
  icon: "📹",
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
          en_US: "Meeting ID to update",
          zh_Hans: "要修改的会议ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      required: false,
      display_name: {
        en_US: "Title",
        zh_Hans: "会议主题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting title (max 64 characters)",
          zh_Hans: "会议主题，最多64个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "meeting_start",
      type: "string",
      required: false,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "会议开始时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting start time as Unix timestamp",
          zh_Hans: "会议开始时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "meeting_duration",
      type: "string",
      required: false,
      display_name: {
        en_US: "Duration (seconds)",
        zh_Hans: "会议持续时间 (秒)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting duration in seconds (min 300, max 86399)",
          zh_Hans: "会议持续时间（秒），最小300秒，最大86399秒",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "media_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Media type",
        zh_Hans: "入会方式",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Meeting media type",
          zh_Hans: "入会方式",
        },
        options: [
          { label: { en_US: "Audio only (0)", zh_Hans: "纯音频 (0)" }, value: "0" },
          { label: { en_US: "Video (1)", zh_Hans: "视频 (1)" }, value: "1" },
          { label: { en_US: "Audio and video (3)", zh_Hans: "音频和视频 (3)" }, value: "3" },
        ],
      },
    },
    {
      name: "invitees",
      type: "string",
      required: false,
      display_name: {
        en_US: "Invitees (JSON array)",
        zh_Hans: "邀请成员 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of invitee userids",
          zh_Hans: "邀请参会成员的userid JSON数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "password",
      type: "string",
      required: false,
      display_name: {
        en_US: "Password",
        zh_Hans: "会议密码",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Meeting password",
          zh_Hans: "会议密码",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      meeting_id?: string
      title?: string
      meeting_start?: string
      meeting_duration?: string
      media_type?: string
      invitees?: string
      password?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const meetingId = params.meeting_id?.trim()
    if (!meetingId) {
      throw new Error("meeting_id is required.")
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
      meetingid: meetingId,
    }

    const title = params.title?.trim()
    if (title) body.title = title

    const meetingStart = params.meeting_start?.trim()
    if (meetingStart) body.meeting_start = parseInt(meetingStart, 10)

    const meetingDuration = params.meeting_duration?.trim()
    if (meetingDuration) body.meeting_duration = parseInt(meetingDuration, 10)

    const mediaType = params.media_type?.trim()
    if (mediaType) body.media_type = parseInt(mediaType, 10)

    const inviteesStr = params.invitees?.trim()
    if (inviteesStr) {
      try {
        const invitees = JSON.parse(inviteesStr)
        if (Array.isArray(invitees)) {
          body.invitees = { userid: invitees }
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const password = params.password?.trim()
    if (password) body.password = password

    await wechatWorkPostJson<UpdateMeetingResponse>(
      "/meeting/update",
      token,
      body,
    )
    return { success: true }
  },
}