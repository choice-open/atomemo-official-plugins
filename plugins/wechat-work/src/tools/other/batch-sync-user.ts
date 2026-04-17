import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import batchSyncUserSkill from "./batch-sync-user-skill.md" with { type: "text" }

type BatchSyncUserResponse = {
  errcode?: number
  errmsg?: string
  job_id?: string
}

export const batchSyncUserTool: ToolDefinition = {
  name: "wechat-work-batch-sync-user",
  display_name: {
    en_US: "Batch sync members (incremental)",
    zh_Hans: "增量导入成员",
  },
  description: {
    en_US: "Incrementally sync members to WeChat Work organization.",
    zh_Hans: "增量导入成员到企业微信通讯录。",
  },
  skill: batchSyncUserSkill,
  icon: "🔄",
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
      name: "media_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Media ID",
        zh_Hans: "文件 media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID of the file containing member data (CSV/JSON format)",
          zh_Hans: "包含成员数据的文件 media_id（通过素材上传接口上传的 CSV/JSON 文件）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "to_invite",
      type: "string",
      required: false,
      display_name: {
        en_US: "Send invitation",
        zh_Hans: "是否发送邀请",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether to send invitation to new members",
          zh_Hans: "是否邀请新成员（通过邮件或微信）",
        },
        options: [
          { label: "Yes (Recommended)", value: "true" },
          { label: "No", value: "false" },
        ],
      },
    },
    {
      name: "callback_url",
      type: "string",
      required: false,
      display_name: {
        en_US: "Callback URL",
        zh_Hans: "回调地址",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "URL to receive async task result notification",
          zh_Hans: "回调URL，用于接收异步任务结果通知",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      media_id?: string
      to_invite?: string
      callback_url?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const mediaId = params.media_id?.trim()
    if (!mediaId) {
      throw new Error("media_id is required.")
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

    const body: Record<string, unknown> = { media_id: mediaId }

    const toInvite = params.to_invite?.trim()
    if (toInvite === "true") {
      body.toInvite = true
    } else if (toInvite === "false") {
      body.toInvite = false
    }

    const callbackUrl = params.callback_url?.trim()
    if (callbackUrl) {
      body.callback = { url: callbackUrl }
    }

    const data = await wechatWorkPostJson<BatchSyncUserResponse>(
      "/batch/syncuser",
      token,
      body,
    )
    return {
      job_id: data.job_id ?? "",
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}