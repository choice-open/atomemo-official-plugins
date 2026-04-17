import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getUserBehaviorDataSkill from "./get-user-behavior-data-skill.md" with { type: "text" }

type GetUserBehaviorDataResponse = {
  errcode?: number
  errmsg?: string
  results?: Array<{
    userid: string
    new_external_contact_cnt: number
    new_contact_with_trail_cnt: number
    msg_sent_volume: number
    reply_rate: number
    avg_reply_time: number
    active_contact_cnt: number
    active_contact_ratio: number
    contact_qy_name_cnt: number
    contact_qy_chat_cnt: number
    msg_sent_volume_qy: number
    msg_sent_volume_ind_qy: number
    new_apply_cnt: number
    new_contact_cnt: number
    new_contact_ratio: number
    quit_contact_cnt: number
    quit_contact_ratio: number
  }>
}

export const getUserBehaviorDataTool: ToolDefinition = {
  name: "wechat-work-get-user-behavior-data",
  display_name: {
    en_US: "Get member behavior data",
    zh_Hans: "获取成员客户数据",
  },
  description: {
    en_US: "Get member customer behavior data statistics.",
    zh_Hans: "获取成员客户行为数据统计。",
  },
  skill: getUserBehaviorDataSkill,
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
      name: "start_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start time as Unix timestamp",
          zh_Hans: "开始时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End time as Unix timestamp",
          zh_Hans: "结束时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "User ID",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Specific userid to get data for (omit for all users)",
          zh_Hans: "要获取数据的成员userid，不填则返回全部",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "string",
      required: false,
      display_name: {
        en_US: "Limit",
        zh_Hans: "限制数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Limit for results (default 1000)",
          zh_Hans: "每页数量，默认1000",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      start_time?: string
      end_time?: string
      userid?: string
      limit?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const startTime = params.start_time?.trim()
    if (!startTime) {
      throw new Error("start_time is required.")
    }

    const endTime = params.end_time?.trim()
    if (!endTime) {
      throw new Error("end_time is required.")
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
      start_time: parseInt(startTime, 10),
      end_time: parseInt(endTime, 10),
    }

    const userid = params.userid?.trim()
    if (userid) body.userid = userid

    const limit = params.limit?.trim()
    if (limit) body.limit = parseInt(limit, 10)

    const data = await wechatWorkPostJson<GetUserBehaviorDataResponse>(
      "/externalcontact/get_user_behavior_data",
      token,
      body,
    )
    return { results: data.results ?? [] }
  },
}