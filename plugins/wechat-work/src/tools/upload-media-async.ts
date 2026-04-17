import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { resolveWechatWorkCredential } from "../wechat-work/client"
import uploadMediaAsyncSkill from "./upload-media-async-skill.md" with { type: "text" }

type UploadMediaAsyncResponse = {
  errcode?: number
  errmsg?: string
  jobid?: string
}

type UploadMediaAsyncResultResponse = {
  errcode?: number
  errmsg?: string
  status?: number
  detail?: {
    errcode?: number
    errmsg?: string
    media_id?: string
    created_at?: string
  }
}

const QYAPI_BASE = "https://qyapi.weixin.qq.com/cgi-bin"

export const uploadMediaAsyncTool: ToolDefinition = {
  name: "wechat-work-upload-media-async",
  display_name: {
    en_US: "Upload media async",
    zh_Hans: "异步上传临时素材",
  },
  description: {
    en_US: "Asynchronously upload large media files (up to 200MB) to WeChat Work via URL.",
    zh_Hans: "通过URL异步上传大文件临时素材（最大200MB）到企业微信。",
  },
  skill: uploadMediaAsyncSkill,
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
        en_US: "Media type",
        zh_Hans: "媒体类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Media type: video (200MB, MP4), file (200MB)",
          zh_Hans: "媒体类型：视频(200MB,MP4)、文件(200MB)",
        },
        options: [
          { label: { en_US: "Video (200MB, MP4)", zh_Hans: "视频(200MB,MP4)" }, value: "video" },
          { label: { en_US: "File (200MB)", zh_Hans: "文件(200MB)" }, value: "file" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "filename",
      type: "string",
      required: true,
      display_name: {
        en_US: "Filename",
        zh_Hans: "文件名",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Original filename with extension (max 128 bytes)",
          zh_Hans: "原始文件名（含扩展名，最大128字节）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "url",
      type: "string",
      required: true,
      display_name: {
        en_US: "File URL",
        zh_Hans: "文件 CDN URL",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "CDN URL of the file (must support Range download, max 1024 bytes)",
          zh_Hans: "文件CDN链接（必须支持Range分块下载，最大1024字节）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "md5",
      type: "string",
      required: true,
      display_name: {
        en_US: "File MD5",
        zh_Hans: "文件 MD5",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "MD5 hash of the file (32 bytes)",
          zh_Hans: "文件的MD5值（32字节）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "wait_for_result",
      type: "boolean",
      required: false,
      display_name: {
        en_US: "Wait for result",
        zh_Hans: "等待结果",
      },
      default: false,
      ui: {
        component: "switch",
        hint: {
          en_US: "Whether to wait for the async upload to complete",
          zh_Hans: "是否等待异步上传完成",
        },
        support_expression: false,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      type?: string
      filename?: string
      url?: string
      md5?: string
      wait_for_result?: boolean
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const type = params.type?.trim()
    const filename = params.filename?.trim()
    const url = params.url?.trim()
    const md5 = params.md5?.trim()
    const waitForResult = params.wait_for_result ?? false

    if (!type || !filename || !url || !md5) {
      throw new Error("type, filename, url, and md5 are required.")
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

    const createTaskUrl = new URL(`${QYAPI_BASE}/media/upload_by_url`)
    createTaskUrl.searchParams.set("access_token", token)

    const createTaskResponse = await fetch(createTaskUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scene: 1,
        type,
        filename,
        url,
        md5,
      }),
    })

    const createTaskData = (await createTaskResponse.json()) as UploadMediaAsyncResponse
    if (createTaskData.errcode !== 0 && createTaskData.errcode !== undefined) {
      throw new Error(
        createTaskData.errmsg ?? `Create async upload task failed (errcode=${String(createTaskData.errcode)})`,
      )
    }

    const jobid = createTaskData.jobid
    if (!jobid) {
      throw new Error("Failed to get jobid from response")
    }

    if (!waitForResult) {
      return {
        jobid: jobid,
        message: "Async upload task created. Use jobid to query result later.",
        media_id: "",
        created_at: "",
      }
    }

    let retryCount = 0
    const maxRetries = 30
    const retryInterval = 2000

    while (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryInterval))

      const resultUrl = new URL(`${QYAPI_BASE}/media/get_upload_by_url_result`)
      resultUrl.searchParams.set("access_token", token)

      const resultResponse = await fetch(resultUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobid }),
      })

      const resultData = (await resultResponse.json()) as UploadMediaAsyncResultResponse

      if (resultData.status === 2) {
        if (resultData.detail?.errcode !== 0 && resultData.detail?.errcode !== undefined) {
          throw new Error(
            resultData.detail.errmsg ?? `Async upload failed (errcode=${String(resultData.detail?.errcode)})`,
          )
        }
        return {
          jobid: jobid,
          media_id: resultData.detail?.media_id ?? "",
          created_at: resultData.detail?.created_at ?? "0",
          message: "",
        }
      } else if (resultData.status === 3) {
        throw new Error(
          resultData.detail?.errmsg ?? `Async upload failed (errcode=${String(resultData.detail?.errcode)})`,
        )
      }

      retryCount++
    }

    throw new Error("Async upload timeout, please query result later with jobid")
  },
}
