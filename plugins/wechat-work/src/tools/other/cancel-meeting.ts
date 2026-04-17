import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import cancelMeetingSkill from "./cancel-meeting-skill.md" with { type: "text" }

type CancelMeetingResponse = {
  errcode?: number
  errmsg?: string
}

export const cancelMeetingTool: ToolDefinition = {
  name: "wechat-work-cancel-meeting",
  display_name: {
    en_US: "Cancel meeting",
    zh_Hans: "取消预约会议",
  },
  description: {
    en_US: "Cancel a scheduled meeting.",
    zh_Hans: "取消已预约的会议。",
  },
  skill: cancelMeetingSkill,
  icon: "❌",
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
          en_US: "Meeting ID to cancel",
          zh_Hans: "要取消的会议ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "reason",
      type: "string",
      required: false,
      display_name: {
        en_US: "Reason",
        zh_Hans: "取消原因",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Cancellation reason",
          zh_Hans: "取消原因",
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
      reason?: string
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

    const body: Record<string, unknown> = { meeting_id: meetingId }

    const reason = params.reason?.trim()
    if (reason) body.reason = reason

    const data = await wechatWorkPostJson<CancelMeetingResponse>(
      "/meeting/cancel",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}