import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getSmartsheetSkill from "./get-smartsheet-skill.md" with { type: "text" }

type GetSmartsheetResponse = {
  errcode?: number
  errmsg?: string
  sheet?: {
    sheet_id?: string
    title?: string
    write_cnt?: number
    columns?: Array<{
      column_id?: string
      column_name?: string
      type?: number
    }>
  }
}

export const getSmartsheetTool: ToolDefinition = {
  name: "wechat-work-get-smartsheet",
  display_name: {
    en_US: "Get smartsheet info",
    zh_Hans: "查询子表",
  },
  description: {
    en_US: "Get information about a smartsheet tab within a WeDoc document.",
    zh_Hans: "获取微文档中智能表格子表的信息。",
  },
  skill: getSmartsheetSkill,
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
          en_US: "The smartsheet tab ID to query",
          zh_Hans: "要查询的智能表格子表 ID",
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

    const data = await wechatWorkPostJson<GetSmartsheetResponse>(
      "/cgi-bin/wedoc/smartsheet/get_sheet",
      token,
      { sheet_id: sheetId },
    )
    return {
      sheet: data.sheet ?? {},
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
