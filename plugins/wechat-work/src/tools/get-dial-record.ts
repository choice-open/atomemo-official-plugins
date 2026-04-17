import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getDialRecordSkill from "./get-dial-record-skill.md" with { type: "text" }

type CallerInfo = {
  userid?: string
  phone?: string
  duration?: number
}

type CalleeInfo = CallerInfo

type DialRecord = {
  call_time?: number
  total_duration?: number
  call_type?: number
  caller?: CallerInfo
  callee?: CalleeInfo[]
}

type GetDialRecordResponse = {
  errcode?: number
  errmsg?: string
  record?: DialRecord[]
}

export const getDialRecordTool: ToolDefinition = {
  name: "wechat-work-get-dial-record",
  display_name: {
    en_US: "Get dial records",
    zh_Hans: "获取通话记录",
  },
  description: {
    en_US: "Get the dial records of WeChat Work phone calls within a specified time range.",
    zh_Hans: "获取企业微信公费电话的通话记录。",
  },
  skill: getDialRecordSkill,
  icon: "📞",
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
      required: false,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Query start time as Unix timestamp",
          zh_Hans: "查询开始时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "string",
      required: false,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Query end time as Unix timestamp",
          zh_Hans: "查询结束时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "offset",
      type: "string",
      required: false,
      display_name: {
        en_US: "Offset",
        zh_Hans: "分页偏移量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pagination offset",
          zh_Hans: "分页查询的偏移量",
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
        zh_Hans: "每页大小",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of records per page (default 100, max 100)",
          zh_Hans: "每页大小，默认100，最大100",
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
      offset?: string
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

    const startTime = params.start_time?.trim()
    if (startTime) {
      body.start_time = parseInt(startTime, 10)
    }

    const endTime = params.end_time?.trim()
    if (endTime) {
      body.end_time = parseInt(endTime, 10)
    }

    const offset = params.offset?.trim()
    if (offset) {
      body.offset = parseInt(offset, 10)
    }

    const limit = params.limit?.trim()
    if (limit) {
      body.limit = parseInt(limit, 10)
    }

    const data = await wechatWorkPostJson<GetDialRecordResponse>(
      "/dial/get_dial_record",
      token,
      body,
    )
    return { record: data.record ?? [] }
  },
}
