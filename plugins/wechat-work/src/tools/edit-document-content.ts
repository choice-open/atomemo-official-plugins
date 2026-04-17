import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import editDocumentContentSkill from "./edit-document-content-skill.md" with { type: "text" }

type EditDocumentContentResponse = {
  errcode?: number
  errmsg?: string
}

export const editDocumentContentTool: ToolDefinition = {
  name: "wechat-work-edit-document-content",
  display_name: {
    en_US: "Edit document content",
    zh_Hans: "编辑文档内容",
  },
  description: {
    en_US: "Edit the content of a WeChat Work document in batch.",
    zh_Hans: "批量编辑企业微信文档内容。",
  },
  skill: editDocumentContentSkill,
  icon: "✏️",
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
        en_US: "Document ID",
        zh_Hans: "文档 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The document ID to edit",
          zh_Hans: "要编辑的文档 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "operations",
      type: "string",
      required: true,
      display_name: {
        en_US: "Operations (JSON array)",
        zh_Hans: "操作列表 (JSON 数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of edit operations",
          zh_Hans: "编辑操作 JSON 数组",
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
      operations?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const docid = params.docid?.trim()
    if (!docid) {
      throw new Error("Document ID is required.")
    }
    const operationsStr = params.operations?.trim()
    if (!operationsStr) {
      throw new Error("Operations data is required.")
    }

    let operations: unknown[]
    try {
      operations = JSON.parse(operationsStr)
      if (!Array.isArray(operations)) {
        throw new Error("Operations must be a JSON array.")
      }
    } catch {
      throw new Error("Operations must be a valid JSON array string.")
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

    const data = await wechatWorkPostJson<EditDocumentContentResponse>(
      "/cgi-bin/wedoc/document/batch_update",
      token,
      { docid, operations },
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
