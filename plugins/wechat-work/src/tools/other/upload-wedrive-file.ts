import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import uploadWedriveFileSkill from "./upload-wedrive-file-skill.md" with { type: "text" }

type UploadFileResponse = {
  errcode?: number
  errmsg?: string
  file_id?: string
  file_name?: string
}

export const uploadWedriveFileTool: ToolDefinition = {
  name: "wechat-work-upload-wedrive-file",
  display_name: {
    en_US: "Upload file to WeDrive",
    zh_Hans: "上传文件到微盘",
  },
  description: {
    en_US: "Upload a file to WeDrive.",
    zh_Hans: "上传文件到微盘。",
  },
  skill: uploadWedriveFileSkill,
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
      name: "space_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Space ID",
        zh_Hans: "空间 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The ID of the WeDrive space",
          zh_Hans: "微盘空间ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "parent_folder_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Parent folder ID",
        zh_Hans: "父文件夹ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The ID of the folder to upload to (root if not provided)",
          zh_Hans: "要上传到的文件夹ID（不提供则为根目录）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "file_content",
      type: "string",
      required: true,
      display_name: {
        en_US: "File content (base64)",
        zh_Hans: "文件内容 (base64)",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Base64 encoded file content",
          zh_Hans: "Base64编码的文件内容",
        },
        width: "full",
      },
    },
    {
      name: "file_name",
      type: "string",
      required: true,
      display_name: {
        en_US: "File name",
        zh_Hans: "文件名",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The name of the file",
          zh_Hans: "文件名",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      space_id?: string
      parent_folder_id?: string
      file_content?: string
      file_name?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const spaceId = params.space_id?.trim()
    if (!spaceId) {
      throw new Error("space_id is required.")
    }
    const fileContent = params.file_content?.trim()
    if (!fileContent) {
      throw new Error("file_content is required.")
    }
    const fileName = params.file_name?.trim()
    if (!fileName) {
      throw new Error("file_name is required.")
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

    const body: Record<string, unknown> = {
      space_id: spaceId,
      file_name: fileName,
      file_base64: fileContent,
    }
    if (params.parent_folder_id?.trim()) {
      body.parent_folder_id = params.parent_folder_id.trim()
    }

    const data = await wechatWorkPostJson<UploadFileResponse>(
      "/wedrive/file_upload",
      token,
      body,
    )
    return {
      file_id: data.file_id ?? null,
      file_name: data.file_name ?? fileName,
    }
  },
}