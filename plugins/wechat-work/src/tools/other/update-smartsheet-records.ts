import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import updateSmartsheetRecordsSkill from "./update-smartsheet-records-skill.md" with { type: "text" }

type UpdateSmartsheetRecordsResponse = {
  errcode?: number
  errmsg?: string
  results?: Array<{
    row_id?: string
    errcode?: number
    errmsg?: string
  }>
}

export const updateSmartsheetRecordsTool: ToolDefinition = {
  name: "wechat-work-update-smartsheet-records",
  display_name: {
    en_US: "Update smartsheet records",
    zh_Hans: "更新记录",
  },
  description: {
    en_US: "Update existing records in a smartsheet tab.",
    zh_Hans: "更新智能表格子表中的现有记录。",
  },
  skill: updateSmartsheetRecordsSkill,
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
      name: "sheet_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Sheet ID",
        zh_Hans: "子表 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The smartsheet tab ID",
          zh_Hans: "智能表格子表 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "records",
      type: "string",
      required: true,
      display_name: {
        en_US: "Records (JSON array)",
        zh_Hans: "记录数据 (JSON 数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of record objects with row_id to update",
          zh_Hans: "包含 row_id 的记录对象 JSON 数组",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      sheet_id?: string
      records?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const sheetId = params.sheet_id?.trim()
    if (!sheetId) {
      throw new Error("Sheet ID is required.")
    }
    const recordsStr = params.records?.trim()
    if (!recordsStr) {
      throw new Error("Records data is required.")
    }

    let records: unknown[]
    try {
      records = JSON.parse(recordsStr)
      if (!Array.isArray(records)) {
        throw new Error("Records must be a JSON array.")
      }
    } catch {
      throw new Error("Records must be a valid JSON array string.")
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

    const data = await wechatWorkPostJson<UpdateSmartsheetRecordsResponse>(
      "/cgi-bin/wedoc/smartsheet/update_records",
      token,
      { sheet_id: sheetId, records },
    )
    return {
      results: data.results ?? [],
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
