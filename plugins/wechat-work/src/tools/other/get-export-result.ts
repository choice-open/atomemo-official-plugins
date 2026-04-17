import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getExportResultSkill from "./get-export-result-skill.md" with { type: "text" }

type GetExportResultResponse = {
  errcode?: number
  errmsg?: string
  status?: number
  title?: string[]
  md5?: string[]
  filename?: string[]
  url?: string[]
}

export const getExportResultTool: ToolDefinition = {
  name: "wechat-work-get-export-result",
  display_name: {
    en_US: "Get export result",
    zh_Hans: "获取导出结果",
  },
  description: {
    en_US: "Get the result of an asynchronous export task.",
    zh_Hans: "获取异步导出任务的结果。",
  },
  skill: getExportResultSkill,
  icon: "📋",
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
      name: "job_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Job ID",
        zh_Hans: "任务 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The job ID returned from export API",
          zh_Hans: "导出接口返回的任务 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      job_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const jobId = params.job_id?.trim()
    if (!jobId) {
      throw new Error("Job ID is required.")
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

    const data = await wechatWorkGetJson<GetExportResultResponse>(
      "/cgi-bin/export/get_result",
      token,
      { job_id: jobId },
    )
    return {
      status: data.status ?? 0,
      title: data.title ?? [],
      md5: data.md5 ?? [],
      filename: data.filename ?? [],
      url: data.url ?? [],
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
