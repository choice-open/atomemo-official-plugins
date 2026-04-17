import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import batchReplacePartySkill from "./batch-replace-party-skill.md" with { type: "text" }

type BatchReplacePartyResponse = {
  errcode?: number
  errmsg?: string
  job_id?: string
}

export const batchReplacePartyTool: ToolDefinition = {
  name: "wechat-work-batch-replace-party",
  display_name: {
    en_US: "Batch replace department (full)",
    zh_Hans: "全量覆盖部门",
  },
  description: {
    en_US: "Fully replace all departments in WeChat Work organization.",
    zh_Hans: "全量覆盖企业微信通讯录部门。",
  },
  skill: batchReplacePartySkill,
  icon: "🏢",
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
          en_US: "Media ID of the file containing department data (JSON format)",
          zh_Hans: "包含部门数据的文件 media_id（通过素材上传接口上传的 JSON 文件）",
        },
        support_expression: true,
        width: "full",
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

    const callbackUrl = params.callback_url?.trim()
    if (callbackUrl) {
      body.callback = { url: callbackUrl }
    }

    const data = await wechatWorkPostJson<BatchReplacePartyResponse>(
      "/batch/replaceparty",
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