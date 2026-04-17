import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getReportSkill from "./get-report-skill.md" with { type: "text" }

type ReportDetailResponse = {
  errcode?: number
  errmsg?: string
  report_info?: {
    report_id: string
    report_type: number
    title?: string
    creator_userid: string
    create_time: number
    modifier_userid?: string
    content?: string
    attachments?: Array<{
      file_id: string
      file_name: string
    }>
  }
}

export const getReportTool: ToolDefinition = {
  name: "wechat-work-get-report",
  display_name: {
    en_US: "Get report details",
    zh_Hans: "获取汇报详情",
  },
  description: {
    en_US: "Get detailed information for a specific report.",
    zh_Hans: "获取指定汇报的详细信息。",
  },
  skill: getReportSkill,
  icon: "📄",
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
      name: "report_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Report ID",
        zh_Hans: "汇报 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The ID of the report to get",
          zh_Hans: "要获取的汇报ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      report_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const reportId = params.report_id?.trim()
    if (!reportId) {
      throw new Error("report_id is required.")
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

    const data = await wechatWorkGetJson<ReportDetailResponse>(
      "/report/get",
      token,
      { report_id: reportId },
    )
    return data.report_info ?? null
  },
}