import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createWedocSkill from "./create-wedoc-skill.md" with { type: "text" }

type CreateWedocResponse = {
  errcode?: number
  errmsg?: string
  docid?: string
}

export const createWedocTool: ToolDefinition = {
  name: "wechat-work-create-wedoc",
  display_name: {
    en_US: "Create WeDoc",
    zh_Hans: "新建文档",
  },
  description: {
    en_US: "Create a new document, spreadsheet, or smartsheet in WeChat Work.",
    zh_Hans: "在企业微信中新建文档、电子表格或智能表格。",
  },
  skill: createWedocSkill,
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
      name: "doc_type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Document type",
        zh_Hans: "文档类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Type of document to create",
          zh_Hans: "要创建的文档类型",
        },
        options: [
          { label: { en_US: "Document (1)", zh_Hans: "文档 (1)" }, value: "1" },
          { label: { en_US: "Spreadsheet (2)", zh_Hans: "表格 (2)" }, value: "2" },
          { label: { en_US: "Smartsheet (3)", zh_Hans: "智能表格 (3)" }, value: "3" },
        ],
      },
    },
    {
      name: "title",
      type: "string",
      required: true,
      display_name: {
        en_US: "Title",
        zh_Hans: "文档标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Title of the new document",
          zh_Hans: "新建文档的标题",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      doc_type?: string
      title?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const docType = params.doc_type?.trim()
    if (!docType || !["1", "2", "3"].includes(docType)) {
      throw new Error("Document type must be 1 (document), 2 (spreadsheet), or 3 (smartsheet).")
    }
    const title = params.title?.trim()
    if (!title) {
      throw new Error("Title is required.")
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

    const data = await wechatWorkPostJson<CreateWedocResponse>(
      "/cgi-bin/wedoc/create_doc",
      token,
      {
        doc_type: parseInt(docType, 10),
        title,
      },
    )
    return {
      docid: data.docid ?? "",
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
