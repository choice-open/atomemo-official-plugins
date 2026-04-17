import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getSmartsheetRecordsSkill from "./get-smartsheet-records-skill.md" with { type: "text" }

type GetSmartsheetRecordsResponse = {
  errcode?: number
  errmsg?: string
  total?: number
  records?: JsonValue[]
}

export const getSmartsheetRecordsTool: ToolDefinition = {
  name: "wechat-work-get-smartsheet-records",
  display_name: {
    en_US: "Get smartsheet records",
    zh_Hans: "查询记录",
  },
  description: {
    en_US: "Query records from a smartsheet tab with optional filtering.",
    zh_Hans: "查询智能表格子表中的记录，支持过滤条件。",
  },
  skill: getSmartsheetRecordsSkill,
  icon: "🔍",
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
      name: "filter",
      type: "string",
      required: false,
      display_name: {
        en_US: "Filter (JSON)",
        zh_Hans: "过滤条件 (JSON)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON filter conditions (optional)",
          zh_Hans: "JSON 格式的过滤条件（可选）",
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
          en_US: "Maximum records to return (default 100)",
          zh_Hans: "最大返回记录数（默认100）",
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
        zh_Hans: "偏移量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of records to skip (default 0)",
          zh_Hans: "跳过的记录数（默认0）",
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
      filter?: string
      limit?: string
      offset?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const sheetId = params.sheet_id?.trim()
    if (!sheetId) {
      throw new Error("Sheet ID is required.")
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

    const requestBody: Record<string, string | number | boolean | object> = {
      sheet_id: sheetId,
    }

    const filter = params.filter?.trim()
    if (filter) {
      try {
        requestBody.filter = JSON.parse(filter)
      } catch {
        throw new Error("Filter must be a valid JSON string.")
      }
    }

    const limit = params.limit?.trim()
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        requestBody.limit = limitNum
      }
    }

    const offset = params.offset?.trim()
    if (offset) {
      const offsetNum = parseInt(offset, 10)
      if (!isNaN(offsetNum) && offsetNum >= 0) {
        requestBody.offset = offsetNum
      }
    }

    const data = await wechatWorkPostJson<GetSmartsheetRecordsResponse>(
      "/cgi-bin/wedoc/smartsheet/get_records",
      token,
      requestBody,
    )
    return {
      total: data.total ?? 0,
      records: data.records ?? [],
    }
  },
}
