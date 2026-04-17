import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listFilesSkill from "./list-files-skill.md" with { type: "text" }

type FileListResponse = {
  errcode?: number
  errmsg?: string
  file_list?: Array<{
    file_id: string
    file_name: string
    file_type: number
    file_size?: number
    parent_folder_id?: string
    create_time?: number
    update_time?: number
    creator?: string
    modifier?: string
  }>
  folder_list?: Array<{
    folder_id: string
    folder_name: string
    parent_folder_id?: string
    create_time?: number
    update_time?: number
    creator?: string
  }>
  next_cursor?: string
}

export const listFilesTool: ToolDefinition = {
  name: "wechat-work-list-files",
  display_name: {
    en_US: "List WeDrive files",
    zh_Hans: "获取微盘文件列表",
  },
  description: {
    en_US: "Get a list of files in a WeDrive space.",
    zh_Hans: "获取微盘空间中的文件列表。",
  },
  skill: listFilesSkill,
  icon: "📂",
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
          en_US: "The ID of the folder to list (root if not provided)",
          zh_Hans: "要列出的文件夹ID（不提供则为根目录）",
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
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const spaceId = params.space_id?.trim()
    if (!spaceId) {
      throw new Error("space_id is required.")
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

    const extraParams: Record<string, string> = { space_id: spaceId }
    if (params.parent_folder_id?.trim()) {
      extraParams.parent_folder_id = params.parent_folder_id.trim()
    }

    const data = await wechatWorkGetJson<FileListResponse>(
      "/wedrive/file_list",
      token,
      extraParams,
    )
    return {
      file_list: data.file_list ?? [],
      folder_list: data.folder_list ?? [],
      next_cursor: data.next_cursor ?? null,
    }
  },
}