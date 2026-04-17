import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getBatchResultSkill from "./get-batch-result-skill.md" with { type: "text" }

type GetBatchResultResponse = {
  errcode?: number
  errmsg?: string
  status?: number
  type?: number
  total?: number
  percentage?: number
  imported?: number
  created?: number
  updated?: number
  removed?: number
  results?: Array<{
    userid: string
    errcode: number
    errmsg: string
  }>
}

export const getBatchResultTool: ToolDefinition = {
  name: "wechat-work-get-batch-result",
  display_name: {
    en_US: "Get batch task result",
    zh_Hans: "获取异步任务结果",
  },
  description: {
    en_US: "Get the result of an async batch task.",
    zh_Hans: "获取异步批量任务的结果。",
  },
  skill: getBatchResultSkill,
  icon: "📊",
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
        zh_Hans: "任务ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Job ID returned from batch sync/replace API",
          zh_Hans: "批量同步/替换接口返回的 job_id",
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
      throw new Error("job_id is required.")
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

    const data = await wechatWorkGetJson<GetBatchResultResponse>(
      "/batch/getresult",
      token,
      { job_id: jobId },
    )
    return {
      status: data.status ?? 0,
      type: data.type ?? 0,
      total: data.total ?? 0,
      percentage: data.percentage ?? 0,
      imported: data.imported ?? 0,
      created: data.created ?? 0,
      updated: data.updated ?? 0,
      removed: data.removed ?? 0,
      results: data.results ?? [],
    }
  },
}