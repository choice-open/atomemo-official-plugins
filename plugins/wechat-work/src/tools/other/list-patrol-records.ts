import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listPatrolRecordsSkill from "./list-patrol-records-skill.md" with {
  type: "text",
}

type ListPatrolRecordsResponse = {
  errcode?: number
  errmsg?: string
  next_cursor?: string
  order_list?: Array<{
    order_id: string
    desc: string
    urge_type: number
    case_name: string
    grid_id: string
    grid_name: string
    create_time: number
    image_urls: string[]
    video_media_ids: string[]
    location: {
      address: string
      latitude: number
      longitude: number
    }
  }>
}

export const listPatrolRecordsTool: ToolDefinition = {
  name: "wechat-work-list-patrol-records",
  display_name: {
    en_US: "List patrol records",
    zh_Hans: "获取巡查记录",
  },
  description: {
    en_US: "Get the list of patrol inspection records.",
    zh_Hans: "获取巡查上报记录列表。",
  },
  skill: listPatrolRecordsSkill,
  icon: "📝",
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
      name: "begin_create_time",
      type: "string",
      required: false,
      display_name: {
        en_US: "Begin create time",
        zh_Hans: "创建时间起始",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Filter reports created after this timestamp",
          zh_Hans: "筛选此时间戳之后创建的上报",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "begin_modify_time",
      type: "string",
      required: false,
      display_name: {
        en_US: "Begin modify time",
        zh_Hans: "修改时间起始",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Filter reports modified after this timestamp",
          zh_Hans: "筛选此时间戳之后修改的上报",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cursor",
        zh_Hans: "翻页游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pagination cursor (empty for first page)",
          zh_Hans: "翻页参数，首次查询为空",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "string",
      required: false,
      display_name: {
        en_US: "Limit",
        zh_Hans: "每页数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of records per page (default 20, max 50)",
          zh_Hans: "单页条数，默认20，最大50",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      begin_create_time?: string
      begin_modify_time?: string
      cursor?: string
      limit?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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

    const body: Record<string, unknown> = {}
    const beginCreateTime = params.begin_create_time?.trim()
    if (beginCreateTime) {
      const t = parseInt(beginCreateTime, 10)
      if (!Number.isNaN(t)) body.begin_create_time = t
    }
    const beginModifyTime = params.begin_modify_time?.trim()
    if (beginModifyTime) {
      const t = parseInt(beginModifyTime, 10)
      if (!Number.isNaN(t)) body.begin_modify_time = t
    }
    const cursor = params.cursor?.trim()
    if (cursor) body.cursor = cursor
    const limit = params.limit?.trim()
    if (limit) {
      const l = parseInt(limit, 10)
      if (!Number.isNaN(l)) body.limit = l
    }

    const data = await wechatWorkPostJson<ListPatrolRecordsResponse>(
      "/report/patrol/get_order_list",
      token,
      body,
    )
    return {
      next_cursor: data.next_cursor ?? "",
      order_list: data.order_list ?? [],
    }
  },
}
