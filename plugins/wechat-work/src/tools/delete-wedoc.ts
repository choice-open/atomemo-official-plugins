import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deleteWedocSkill from "./delete-wedoc-skill.md" with { type: "text" }

type DeleteWedocResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteWedocTool: ToolDefinition = {
  name: "wechat-work-delete-wedoc",
  display_name: {
    en_US: "Delete document",
    zh_Hans: "删除文档",
  },
  description: {
    en_US: "Delete a WeDoc document.",
    zh_Hans: "删除微文档。",
  },
  skill: deleteWedocSkill,
  icon: "🗑️",
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
          en_US: "The document ID to delete",
          zh_Hans: "要删除的文档 ID",
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

    const data = await wechatWorkPostJson<DeleteWedocResponse>(
      "/cgi-bin/wedoc/del_doc",
      token,
      { docid },
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
