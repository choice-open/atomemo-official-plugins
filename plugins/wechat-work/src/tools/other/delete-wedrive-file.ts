import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deleteWedriveFileSkill from "./delete-wedrive-file-skill.md" with { type: "text" }

type DeleteFileResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteWedriveFileTool: ToolDefinition = {
  name: "wechat-work-delete-wedrive-file",
  display_name: {
    en_US: "Delete WeDrive file",
    zh_Hans: "删除微盘文件",
  },
  description: {
    en_US: "Delete a file from WeDrive.",
    zh_Hans: "从微盘删除文件。",
  },
  skill: deleteWedriveFileSkill,
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
      name: "file_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "File ID",
        zh_Hans: "文件 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The ID of the file to delete",
          zh_Hans: "要删除的文件ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      file_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const fileId = params.file_id?.trim()
    if (!fileId) {
      throw new Error("file_id is required.")
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

    await wechatWorkPostJson<DeleteFileResponse>(
      "/wedrive/file_del",
      token,
      { file_id: fileId },
    )
    return { success: true }
  },
}