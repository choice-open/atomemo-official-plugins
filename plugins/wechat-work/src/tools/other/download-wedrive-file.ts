import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { resolveWechatWorkCredential } from "../wechat-work/client"
import downloadWedriveFileSkill from "./download-wedrive-file-skill.md" with { type: "text" }

const QYAPI_BASE = "https://qyapi.weixin.qq.com/cgi-bin"

type DownloadResponse = {
  errcode?: number
  errmsg?: string
  file_content?: string
}

export const downloadWedriveFileTool: ToolDefinition = {
  name: "wechat-work-download-wedrive-file",
  display_name: {
    en_US: "Download WeDrive file",
    zh_Hans: "下载微盘文件",
  },
  description: {
    en_US: "Download a file from WeDrive.",
    zh_Hans: "从微盘下载文件。",
  },
  skill: downloadWedriveFileSkill,
  icon: "📥",
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
          en_US: "The ID of the file to download",
          zh_Hans: "要下载的文件ID",
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

    const url = new URL(`${QYAPI_BASE}/wedrive/file_download`)
    url.searchParams.set("access_token", token)
    url.searchParams.set("file_id", fileId)

    const res = await fetch(url)
    const data = (await res.json()) as DownloadResponse

    if (data.errcode !== undefined && data.errcode !== 0) {
      throw new Error(
        data.errmsg ??
          `WeChat Work API error (errcode=${String(data.errcode)})`,
      )
    }

    return { file_content: data.file_content ?? null }
  },
}