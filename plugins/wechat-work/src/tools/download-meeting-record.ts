import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import downloadMeetingRecordSkill from "./download-meeting-record-skill.md" with { type: "text" }

type DownloadMeetingRecordResponse = {
  errcode?: number
  errmsg?: string
  download_url?: string
  file_size?: number
}

export const downloadMeetingRecordTool: ToolDefinition = {
  name: "wechat-work-download-meeting-record",
  display_name: {
    en_US: "Download meeting record",
    zh_Hans: "下载录制文件",
  },
  description: {
    en_US: "Get download URL for a meeting recording file.",
    zh_Hans: "获取会议录制文件下载链接。",
  },
  skill: downloadMeetingRecordSkill,
  icon: "⬇️",
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
          en_US: "Meeting ID to download recording",
          zh_Hans: "要下载录制的会议ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "record_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Record ID",
        zh_Hans: "录制ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Specific record ID (optional)",
          zh_Hans: "指定录制ID(可选)",
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
      record_id?: string
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

    const extraParams: Record<string, string> = {
      meeting_id: meetingId,
    }

    const recordId = params.record_id?.trim()
    if (recordId) extraParams.record_id = recordId

    const data = await wechatWorkGetJson<DownloadMeetingRecordResponse>(
      "/meeting/record/download",
      token,
      extraParams,
    )
    return {
      download_url: data.download_url ?? "",
      file_size: data.file_size ?? 0,
    }
  },
}
