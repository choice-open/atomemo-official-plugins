import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import kickoutMeetingMemberSkill from "./kickout-meeting-member-skill.md" with { type: "text" }

type KickoutMeetingMemberResponse = {
  errcode?: number
  errmsg?: string
}

export const kickoutMeetingMemberTool: ToolDefinition = {
  name: "wechat-work-kickout-meeting-member",
  display_name: {
    en_US: "Kickout meeting member",
    zh_Hans: "踢出成员",
  },
  description: {
    en_US: "Remove a member from an ongoing meeting.",
    zh_Hans: "将成员踢出会议。",
  },
  skill: kickoutMeetingMemberSkill,
  icon: "🚪",
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
          en_US: "Meeting ID to kick member from",
          zh_Hans: "要踢出成员的会议ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "User ID",
        zh_Hans: "成员ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "User ID to kick out",
          zh_Hans: "要踢出的成员userid",
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
      userid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const meetingId = params.meeting_id?.trim()
    if (!meetingId) {
      throw new Error("meeting_id is required.")
    }

    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("userid is required.")
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
      userid,
    }

    const data = await wechatWorkPostJson<KickoutMeetingMemberResponse>(
      "/meeting/kickout",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
