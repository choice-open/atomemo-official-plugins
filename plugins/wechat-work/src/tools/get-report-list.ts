import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getReportListSkill from "./get-report-list-skill.md" with { type: "text" }

type ReportListResponse = {
  errcode?: number
  errmsg?: string
  report_list?: Array<{
    report_id: string
    report_type: number
    creator_userid: string
    create_time: number
    modifier_userid?: string
    title?: string
  }>
  total_count?: number
}

export const getReportListTool: ToolDefinition = {
  name: "wechat-work-get-report-list",
  display_name: {
    en_US: "Get report list",
    zh_Hans: "获取汇报记录",
  },
  description: {
    en_US: "Get a list of reports within a time range.",
    zh_Hans: "获取指定时间范围内的汇报记录列表。",
  },
  skill: getReportListSkill,
  icon: "📋",
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
      name: "starttime",
      type: "string",
      required: true,
      display_name: {
        en_US: "Start time",
        zh_Hans: "开始时间",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start timestamp (Unix seconds)",
          zh_Hans: "开始时间戳（Unix秒）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "endtime",
      type: "string",
      required: true,
      display_name: {
        en_US: "End time",
        zh_Hans: "结束时间",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End timestamp (Unix seconds)",
          zh_Hans: "结束时间戳（Unix秒）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "creator_userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Creator userid",
        zh_Hans: "创建人 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Filter by report creator userid",
          zh_Hans: "按汇报创建人 userid 筛选",
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
        zh_Hans: "分页游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pagination cursor",
          zh_Hans: "分页游标",
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
        zh_Hans: "返回数量限制",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Maximum number of reports to return",
          zh_Hans: "返回的最大记录数",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      starttime?: string
      endtime?: string
      creator_userid?: string
      cursor?: string
      limit?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const starttime = params.starttime?.trim()
    if (!starttime) {
      throw new Error("starttime is required.")
    }
    const endtime = params.endtime?.trim()
    if (!endtime) {
      throw new Error("endtime is required.")
    }

    const extraParams: Record<string, string> = {
      starttime,
      endtime,
    }

    const creatorUserid = params.creator_userid?.trim()
    if (creatorUserid) extraParams.creator_userid = creatorUserid

    const cursor = params.cursor?.trim()
    if (cursor) extraParams.cursor = cursor

    const limit = params.limit?.trim()
    if (limit) extraParams.limit = limit

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

    const data = await wechatWorkGetJson<ReportListResponse>(
      "/report/get_list",
      token,
      extraParams,
    )
    return {
      report_list: data.report_list ?? [],
      total_count: data.total_count ?? 0,
    }
  },
}