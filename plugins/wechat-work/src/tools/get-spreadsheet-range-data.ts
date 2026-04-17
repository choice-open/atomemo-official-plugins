import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import type { JsonValue } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getSpreadsheetRangeDataSkill from "./get-spreadsheet-range-data-skill.md" with { type: "text" }

type GetSpreadsheetRangeDataResponse = {
  errcode?: number
  errmsg?: string
  sheet_id?: string
  title?: string
  row_count?: number
  col_count?: number
  data?: JsonValue[][]
}

export const getSpreadsheetRangeDataTool: ToolDefinition = {
  name: "wechat-work-get-spreadsheet-range-data",
  display_name: {
    en_US: "Get spreadsheet range data",
    zh_Hans: "获取表格数据",
  },
  description: {
    en_US: "Get data from a specific range in a WeChat Work spreadsheet.",
    zh_Hans: "获取企业微信表格指定范围的数据。",
  },
  skill: getSpreadsheetRangeDataSkill,
  icon: "📊",
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
      name: "docid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Spreadsheet ID",
        zh_Hans: "表格 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The spreadsheet ID",
          zh_Hans: "表格文档 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "sheet_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Sheet ID",
        zh_Hans: "工作表 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The sheet ID within the spreadsheet",
          zh_Hans: "工作表 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "range",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cell range",
        zh_Hans: "单元格范围",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Range like 'A1:B10' (optional)",
          zh_Hans: "范围如 'A1:B10'（可选）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      docid?: string
      sheet_id?: string
      range?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const docid = params.docid?.trim()
    if (!docid) {
      throw new Error("Spreadsheet ID is required.")
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

    const requestBody: Record<string, string> = {
      docid,
      sheet_id: sheetId,
    }

    const range = params.range?.trim()
    if (range) {
      requestBody.range = range
    }

    const data = await wechatWorkPostJson<GetSpreadsheetRangeDataResponse>(
      "/cgi-bin/wedoc/spreadsheet/get_sheet_range_data",
      token,
      requestBody,
    )
    return {
      sheet_id: data.sheet_id ?? "",
      title: data.title ?? "",
      row_count: data.row_count ?? 0,
      col_count: data.col_count ?? 0,
      data: data.data ?? [],
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
