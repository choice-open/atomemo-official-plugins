import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import batchGetExternalContactsSkill from "./batch-get-external-contacts-skill.md" with {
  type: "text",
}

type BatchGetExternalContactResponse = {
  errcode?: number
  errmsg?: string
  external_contact?: {
    external_userid: string
    type: number
    name: string
    avatar: string
    gender: number
    unionid?: string
    position?: string
    corp_name?: string
    corp_full_name?: string
  }
  follow_user?: Array<{
    userid: string
    state: string
    remark?: string
    description?: string
    createtime: number
    tags?: Array<{
      tag_name: string
      tag_id: string
    }>
  }>
}

export const batchGetExternalContactsTool: ToolDefinition = {
  name: "wechat-work-batch-get-external-contacts",
  display_name: {
    en_US: "Batch get external contacts",
    zh_Hans: "批量获取客户详情",
  },
  description: {
    en_US: "Batch get detailed information of external contacts for a staff member.",
    zh_Hans: "批量获取成员的外部联系人详细信息。",
  },
  skill: batchGetExternalContactsSkill,
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
      name: "userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Staff User ID",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the staff who added the external contacts",
          zh_Hans: "添加了外部联系人的成员userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "external_userid",
      type: "string",
      display_name: {
        en_US: "External user IDs (JSON array)",
        zh_Hans: "外部联系人 userid 列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: 'JSON array of external userids, e.g., ["woxxxxxxxx","woyyyyyyy"]',
          zh_Hans: '外部联系人userid的JSON数组，如 ["woxxxxxxxx","woyyyyyyy"]',
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "string",
      display_name: {
        en_US: "Limit per page",
        zh_Hans: "每页数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of results per page (default: 100, max: 100)",
          zh_Hans: "每页返回数量，默认100，最大100",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cursor",
      type: "string",
      display_name: {
        en_US: "Cursor",
        zh_Hans: "分页游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pagination cursor from previous response",
          zh_Hans: "分页游标，使用上次返回的next_cursor",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      userid?: string
      external_userid?: string
      limit?: string
      cursor?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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

    const body: Record<string, unknown> = { userid }

    if (params.external_userid?.trim()) {
      try {
        body.external_userid = JSON.parse(params.external_userid.trim())
      } catch {
        throw new Error("Invalid JSON in external_userid field")
      }
    }

    const limit = params.limit?.trim()
    if (limit) {
      const l = parseInt(limit, 10)
      if (!Number.isNaN(l) && l > 0) {
        body.limit = Math.min(l, 100)
      }
    }

    const cursor = params.cursor?.trim()
    if (cursor) body.cursor = cursor

    const data = await wechatWorkPostJson<BatchGetExternalContactResponse>(
      "/externalcontact/batchget_by_user",
      token,
      body,
    )
    return {
      external_contact: data.external_contact ?? null,
      follow_user: data.follow_user ?? [],
    }
  },
}
