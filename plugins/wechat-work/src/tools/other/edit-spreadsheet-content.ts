import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import editSpreadsheetContentSkill from "./edit-spreadsheet-content-skill.md" with { type: "text" }

type EditSpreadsheetContentResponse = {
  errcode?: number
  errmsg?: string
}

export const editSpreadsheetContentTool: ToolDefinition = {
  name: "wechat-work-edit-spreadsheet-content",
  display_name: {
    en_US: "Edit spreadsheet content",
    zh_Hans: "编辑表格内容",
  },
  description: {
    en_US: "Edit cell data in a WeChat Work spreadsheet.",
    zh_Hans: "编辑企业微信表格的单元格数据。",
  },
  skill: editSpreadsheetContentSkill,
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
      name: "cells",
      type: "string",
      required: true,
      display_name: {
        en_US: "Cell data (JSON)",
        zh_Hans: "单元格数据 (JSON)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON object of cell data to update",
          zh_Hans: "要更新的单元格数据 JSON 对象",
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
      cells?: string
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
    const cellsStr = params.cells?.trim()
    if (!cellsStr) {
      throw new Error("Cell data is required.")
    }

    let cells: unknown
    try {
      cells = JSON.parse(cellsStr)
    } catch {
      throw new Error("Cell data must be a valid JSON string.")
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

    const data = await wechatWorkPostJson<EditSpreadsheetContentResponse>(
      "/cgi-bin/wedoc/spreadsheet/batch_update",
      token,
      { docid, sheet_id: sheetId, cells },
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
