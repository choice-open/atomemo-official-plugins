import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import inviteMeetingMemberSkill from "./invite-meeting-member-skill.md" with { type: "text" }

type InviteMeetingMemberResponse = {
  errcode?: number
  errmsg?: string
  invalid_userids?: string[]
  invalid_partyids?: string[]
}

export const inviteMeetingMemberTool: ToolDefinition = {
  name: "wechat-work-invite-meeting-member",
  display_name: {
    en_US: "Invite meeting member",
    zh_Hans: "邀请成员",
  },
  description: {
    en_US: "Invite members to an ongoing meeting.",
    zh_Hans: "邀请成员进入会议中。",
  },
  skill: inviteMeetingMemberSkill,
  icon: "👥",
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
          en_US: "Meeting ID to invite members to",
          zh_Hans: "要邀请成员的会议ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "userids",
      type: "string",
      required: false,
      display_name: {
        en_US: "User IDs (JSON array)",
        zh_Hans: "成员ID (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of user IDs to invite",
          zh_Hans: "要邀请的成员userid的JSON数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "partyids",
      type: "string",
      required: false,
      display_name: {
        en_US: "Department IDs (JSON array)",
        zh_Hans: "部门ID (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of department IDs to invite",
          zh_Hans: "要邀请的部门ID的JSON数组",
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
      userids?: string
      partyids?: string
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

    const useridsStr = params.userids?.trim()
    if (useridsStr) {
      try {
        const userids = JSON.parse(useridsStr)
        if (Array.isArray(userids)) {
          body.userids = userids
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const partyidsStr = params.partyids?.trim()
    if (partyidsStr) {
      try {
        const partyids = JSON.parse(partyidsStr)
        if (Array.isArray(partyids)) {
          body.partyids = partyids
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const data = await wechatWorkPostJson<InviteMeetingMemberResponse>(
      "/meeting/invite",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      invalid_userids: data.invalid_userids ?? [],
      invalid_partyids: data.invalid_partyids ?? [],
    }
  },
}
