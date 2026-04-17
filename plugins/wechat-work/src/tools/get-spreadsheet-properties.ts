import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getSpreadsheetPropertiesSkill from "./get-spreadsheet-properties-skill.md" with { type: "text" }

type GetSpreadsheetPropertiesResponse = {
  errcode?: number
  errmsg?: string
  sheet_properties?: Array<{
    sheet_id?: string
    title?: string
    index?: number
    row_count?: number
    col_count?: number
  }>
}

export const getSpreadsheetPropertiesTool: ToolDefinition = {
  name: "wechat-work-get-spreadsheet-properties",
  display_name: {
    en_US: "Get spreadsheet sheet properties",
    zh_Hans: "获取表格行列信息",
  },
  description: {
    en_US: "Get properties of sheets in a WeChat Work spreadsheet, including row and column counts.",
    zh_Hans: "获取企业微信表格的工作表属性，包括行列数。",
  },
  skill: getSpreadsheetPropertiesSkill,
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
      name: "sheet_ids",
      type: "string",
      required: false,
      display_name: {
        en_US: "Sheet IDs (JSON array)",
        zh_Hans: "工作表 ID 列表 (JSON 数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of sheet IDs to query (optional)",
          zh_Hans: "要查询的工作表 ID JSON 数组（可选）",
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
      sheet_ids?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const docid = params.docid?.trim()
    if (!docid) {
      throw new Error("Spreadsheet ID is required.")
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
    }

    const sheetIdsStr = params.sheet_ids?.trim()
    if (sheetIdsStr) {
      try {
        const sheetIds = JSON.parse(sheetIdsStr)
        if (Array.isArray(sheetIds)) {
          requestBody.sheet_ids = JSON.stringify(sheetIds)
        }
      } catch {
        throw new Error("Sheet IDs must be a valid JSON array string.")
      }
    }

    const data = await wechatWorkPostJson<GetSpreadsheetPropertiesResponse>(
      "/cgi-bin/wedoc/spreadsheet/get_sheet_properties",
      token,
      requestBody,
    )
    return {
      sheet_properties: data.sheet_properties ?? [],
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
