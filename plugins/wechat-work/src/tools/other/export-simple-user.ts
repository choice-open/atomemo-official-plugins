import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import exportSimpleUserSkill from "./export-simple-user-skill.md" with { type: "text" }

type ExportSimpleUserResponse = {
  errcode?: number
  errmsg?: string
  job_id?: string
}

export const exportSimpleUserTool: ToolDefinition = {
  name: "wechat-work-export-simple-user",
  display_name: {
    en_US: "Export members (simplified)",
    zh_Hans: "导出成员(简化)",
  },
  description: {
    en_US: "Export member information from WeChat Work organization in simplified format.",
    zh_Hans: "以简化格式导出企业微信通讯录中的成员信息。",
  },
  skill: exportSimpleUserSkill,
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
      name: "type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Member type",
        zh_Hans: "成员类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Type of members to export",
          zh_Hans: "要导出的成员类型",
        },
        options: [
          { label: { en_US: "Active (1)", zh_Hans: "在职 (1)" }, value: "1" },
          { label: { en_US: "Resigned (2)", zh_Hans: "离职 (2)" }, value: "2" },
        ],
      },
    },
    {
      name: "userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "User ID",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Specific user ID to export (optional, exports all if empty)",
          zh_Hans: "指定成员的 userid（留空则导出全部）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "full_export",
      type: "string",
      required: false,
      display_name: {
        en_US: "Full export",
        zh_Hans: "全量导出",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether to export all fields",
          zh_Hans: "是否全量导出",
        },
        options: [
          { label: { en_US: "Yes (Recommended)", zh_Hans: "是 (推荐)" }, value: "true" },
          { label: { en_US: "No", zh_Hans: "否" }, value: "false" },
        ],
      },
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      display_name: {
        en_US: "Cursor",
        zh_Hans: "游标",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Pagination cursor for subsequent exports",
          zh_Hans: "分页游标，用于后续分页导出",
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
          en_US: "Maximum number of records per page (1-10000)",
          zh_Hans: "每页获取的数据条数（1-10000）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      type?: string
      userid?: string
      full_export?: string
      cursor?: string
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

    const type = params.type?.trim()
    if (type === "1" || type === "2") {
      body.type = parseInt(type, 10)
    }

    const userid = params.userid?.trim()
    if (userid) {
      body.userid = userid
    }

    const fullExport = params.full_export?.trim()
    if (fullExport === "true") {
      body.full_export = true
    } else if (fullExport === "false") {
      body.full_export = false
    }

    const cursor = params.cursor?.trim()
    if (cursor) {
      body.cursor = cursor
    }

    const limit = params.limit?.trim()
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum >= 1 && limitNum <= 10000) {
        body.limit = limitNum
      }
    }

    const data = await wechatWorkPostJson<ExportSimpleUserResponse>(
      "/cgi-bin/export/simple_user",
      token,
      body,
    )
    return {
      job_id: data.job_id ?? "",
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
