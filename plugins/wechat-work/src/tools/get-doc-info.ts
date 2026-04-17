import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getDocInfoSkill from "./get-doc-info-skill.md" with { type: "text" }

type GetDocInfoResponse = {
  errcode?: number
  errmsg?: string
  doc_info?: {
    docid?: string
    title?: string
    create_time?: number
    latest_time?: number
    author?: {
      userid?: string
      name?: string
    }
  }
}

export const getDocInfoTool: ToolDefinition = {
  name: "wechat-work-get-doc-info",
  display_name: {
    en_US: "Get document info",
    zh_Hans: "获取文档基础信息",
  },
  description: {
    en_US: "Get basic information about a WeDoc document.",
    zh_Hans: "获取微文档的基础信息。",
  },
  skill: getDocInfoSkill,
  icon: "ℹ️",
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
          en_US: "The document ID to query",
          zh_Hans: "要查询的文档 ID",
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

    const data = await wechatWorkPostJson<GetDocInfoResponse>(
      "/cgi-bin/wedoc/get_doc_base_info",
      token,
      { docid },
    )
    return {
      doc_info: data.doc_info ?? {},
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
