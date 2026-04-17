import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getMeetingInfoSkill from "./get-meeting-info-skill.md" with { type: "text" }

type GetMeetingInfoResponse = {
  errcode?: number
  errmsg?: string
  meeting_info?: {
    meeting_id: string
    title: string
    start_time: number
    end_time: number
    meeting_type: number
    status: number
    organizer: { userid: string }
    attendees?: Array<{ userid: string; join_time: number }>
    meeting_code?: string
    password?: string
  }
}

export const getMeetingInfoTool: ToolDefinition = {
  name: "wechat-work-get-meeting-info",
  display_name: {
    en_US: "Get meeting details",
    zh_Hans: "获取会议详情",
  },
  description: {
    en_US: "Get the details of a meeting.",
    zh_Hans: "获取企业微信会议的详情。",
  },
  skill: getMeetingInfoSkill,
  icon: "🔍",
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
          en_US: "Meeting ID to get",
          zh_Hans: "要获取详情的会议ID",
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

    const data = await wechatWorkPostJson<GetMeetingInfoResponse>(
      "/meeting/get_info",
      token,
      { meeting_id: meetingId },
    )
    return data.meeting_info ?? null
  },
}