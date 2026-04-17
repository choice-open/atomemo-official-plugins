import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getMeetingRecordSkill from "./get-meeting-record-skill.md" with { type: "text" }

type GetMeetingRecordResponse = {
  errcode?: number
  errmsg?: string
  record_info?: {
    meeting_id: string
    record_id: string
    file_name: string
    file_size: number
    download_url: string
    record_start_time: number
    record_end_time: number
  }
}

export const getMeetingRecordTool: ToolDefinition = {
  name: "wechat-work-get-meeting-record",
  display_name: {
    en_US: "Get meeting record",
    zh_Hans: "获取录制文件",
  },
  description: {
    en_US: "Get meeting recording file information.",
    zh_Hans: "获取会议录制文件信息。",
  },
  skill: getMeetingRecordSkill,
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
          en_US: "Meeting ID to get recording",
          zh_Hans: "要获取录制的会议ID",
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

    const data = await wechatWorkGetJson<GetMeetingRecordResponse>(
      "/meeting/record/get",
      token,
      { meeting_id: meetingId },
    )
    return { record_info: data.record_info }
  },
}
