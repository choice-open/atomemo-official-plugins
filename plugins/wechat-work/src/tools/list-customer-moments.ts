import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listCustomerMomentsSkill from "./list-customer-moments-skill.md" with { type: "text" }

type ListCustomerMomentsResponse = {
  errcode?: number
  errmsg?: string
  next_cursor?: string
  moment_list?: Array<{
    moment_id: string
    creator: string
    create_time: number
    content_type: number
    text_content?: { content: string }
    image_list?: Array<{ url: string }>
    video_list?: Array<{ url: string; thumb_url: string }>
  }>
}

export const listCustomerMomentsTool: ToolDefinition = {
  name: "wechat-work-list-customer-moments",
  display_name: {
    en_US: "List customer moments",
    zh_Hans: "获取客户朋友圈列表",
  },
  description: {
    en_US: "Get the list of customer moments (朋友圈).",
    zh_Hans: "获取客户朋友圈列表。",
  },
  skill: listCustomerMomentsSkill,
  icon: "📷",
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
      name: "start_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start time as Unix timestamp",
          zh_Hans: "开始时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End time as Unix timestamp",
          zh_Hans: "结束时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "creator",
      type: "string",
      required: false,
      display_name: {
        en_US: "Creator userid",
        zh_Hans: "创建者 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Filter by creator userid",
          zh_Hans: "按创建者userid筛选",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "filter_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Filter type",
        zh_Hans: "筛选类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Filter type",
          zh_Hans: "筛选类型",
        },
        options: [
          { label: "All (0)", value: "0" },
          { label: "Created by me (1)", value: "1" },
          { label: "Mentioned me (2)", value: "2" },
        ],
      },
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cursor",
        zh_Hans: "分页游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pagination cursor from previous response",
          zh_Hans: "上一次分页返回的游标",
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
        zh_Hans: "返回数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Maximum number of records to return (max: 100)",
          zh_Hans: "返回的最大记录数，最大值100",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      start_time?: string
      end_time?: string
      creator?: string
      filter_type?: string
      cursor?: string
      limit?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const startTime = params.start_time?.trim()
    if (!startTime) {
      throw new Error("start_time is required.")
    }

    const endTime = params.end_time?.trim()
    if (!endTime) {
      throw new Error("end_time is required.")
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
      start_time: parseInt(startTime, 10),
      end_time: parseInt(endTime, 10),
    }

    const creator = params.creator?.trim()
    if (creator) body.creator = creator

    const filterType = params.filter_type?.trim()
    if (filterType) body.filter_type = parseInt(filterType, 10)

    const cursor = params.cursor?.trim()
    if (cursor) body.cursor = cursor

    const limit = params.limit?.trim()
    if (limit) body.limit = parseInt(limit, 10)

    const data = await wechatWorkPostJson<ListCustomerMomentsResponse>(
      "/externalcontact/moment/list",
      token,
      body,
    )
    return {
      next_cursor: data.next_cursor ?? "",
      moment_list: data.moment_list ?? [],
    }
  },
}