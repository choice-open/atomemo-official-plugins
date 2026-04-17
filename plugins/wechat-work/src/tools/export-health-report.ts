import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import exportHealthReportSkill from "./export-health-report-skill.md" with { type: "text" }

type ExportHealthReportResponse = {
  errcode?: number
  errmsg?: string
  url?: string
  expire_time?: number
}

export const exportHealthReportTool: ToolDefinition = {
  name: "wechat-work-export-health-report",
  display_name: {
    en_US: "Export health report data",
    zh_Hans: "导出健康上报数据",
  },
  description: {
    en_US: "Export health report data to a file.",
    zh_Hans: "导出健康上报数据到文件。",
  },
  skill: exportHealthReportSkill,
  icon: "📤",
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
        zh_Hans: "健康上报ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The health report ID",
          zh_Hans: "健康上报ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "school_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "School ID",
        zh_Hans: "学校ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "School ID from education management console",
          zh_Hans: "家校管理后台的学校ID",
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
      school_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const reportId = params.report_id?.trim()
    const schoolId = params.school_id?.trim()
    if (!reportId || !schoolId) {
      throw new Error("report_id and school_id are required.")
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
      report_id: reportId,
      school_id: schoolId,
    }

    const data = await wechatWorkPostJson<ExportHealthReportResponse>(
      "/school/health/export_report",
      token,
      body,
    )
    return data
  },
}