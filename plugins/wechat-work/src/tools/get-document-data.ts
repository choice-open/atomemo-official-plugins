import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getDocumentDataSkill from "./get-document-data-skill.md" with { type: "text" }

type GetDocumentDataResponse = {
  errcode?: number
  errmsg?: string
  document?: {
    docid?: string
    title?: string
    owner?: string
    create_time?: number
    update_time?: number
    content?: string
  }
}

export const getDocumentDataTool: ToolDefinition = {
  name: "wechat-work-get-document-data",
  display_name: {
    en_US: "Get document data",
    zh_Hans: "获取文档数据",
  },
  description: {
    en_US: "Get the content of a WeChat Work document.",
    zh_Hans: "获取企业微信文档的内容。",
  },
  skill: getDocumentDataSkill,
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
          en_US: "The document ID to retrieve",
          zh_Hans: "要获取的文档 ID",
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
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const docid = params.docid?.trim()
    if (!docid) {
      throw new Error("Document ID is required.")
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

    const data = await wechatWorkPostJson<GetDocumentDataResponse>(
      "/cgi-bin/wedoc/document/get",
      token,
      { docid },
    )
    return {
      document: data.document ?? {},
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
