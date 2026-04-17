import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getKfCorpStatisticSkill from "./get-kf-corp-statistic-skill.md" with { type: "text" }

type StatisticItem = {
  stat_time?: number
  chat_cnt?: number
  msg_cnt?: number
  customer_cnt?: number
  add_customer_cnt?: number
  peak_concurrent_cnt?: number
}

type GetKfCorpStatisticResponse = {
  errcode?: number
  errmsg?: string
  statistic_list?: StatisticItem[]
}

export const getKfCorpStatisticTool: ToolDefinition = {
  name: "wechat-work-get-kf-corp-statistic",
  display_name: {
    en_US: "Get customer service statistics",
    zh_Hans: "获取客服企业统计",
  },
  description: {
    en_US: "Get customer service enterprise statistics.",
    zh_Hans: "获取客服企业汇总统计数据。",
  },
  skill: getKfCorpStatisticSkill,
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
      name: "open_kfid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Customer service account ID",
        zh_Hans: "客服账号ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Customer service account ID (open_kfid)",
          zh_Hans: "客服账号ID (open_kfid)",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "start_time",
      type: "number",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间（Unix时间戳）",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start time (Unix timestamp, 0:00:00 of the day)",
          zh_Hans: "开始时间（Unix时间戳，当天的0时0分0秒）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "number",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间（Unix时间戳）",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End time (Unix timestamp, 0:00:00 of the day)",
          zh_Hans: "结束时间（Unix时间戳，当天的0时0分0秒）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      open_kfid?: string
      start_time?: number
      end_time?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const openKfid = params.open_kfid?.trim()
    if (!openKfid) {
      throw new Error("open_kfid is required.")
    }

    const startTime = params.start_time
    if (typeof startTime !== "number" || startTime <= 0) {
      throw new Error("start_time is required and must be a positive number.")
    }

    const endTime = params.end_time
    if (typeof endTime !== "number" || endTime <= 0) {
      throw new Error("end_time is required and must be a positive number.")
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
      open_kfid: openKfid,
      start_time: startTime,
      end_time: endTime,
    }

    const data = await wechatWorkPostJson<GetKfCorpStatisticResponse>(
      "/kf/get_corp_statistic",
      token,
      body,
    )
    return { statistic_list: data.statistic_list ?? [] }
  },
}