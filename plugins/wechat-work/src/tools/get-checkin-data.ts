import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getCheckinDataSkill from "./get-checkin-data-skill.md" with { type: "text" }

type CheckinDataResponse = {
  errcode?: number
  errmsg?: string
  checkindata?: Array<{
    userid?: string
    name?: string
    groupname?: string
    checkin_type?: string
    time?: number
    location_title?: string
    location_detail?: string
    wifiname?: string
    wifimac?: string
    media_id?: string
    remark?: string
  }>
}

export const getCheckinDataTool: ToolDefinition = {
  name: "wechat-work-get-checkin-data",
  display_name: {
    en_US: "Get checkin records",
    zh_Hans: "获取打卡记录",
  },
  description: {
    en_US: "Get member checkin records within a specified time range.",
    zh_Hans: "获取指定时间范围内的成员打卡记录。",
  },
  skill: getCheckinDataSkill,
  icon: "⏰",
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
      name: "opencheckindatatype",
      type: "string",
      required: true,
      display_name: {
        en_US: "Checkin type",
        zh_Hans: "打卡类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "1: Work shift; 2: Outgoing; 3: All",
          zh_Hans: "1：上下班打卡；2：外出打卡；3：全部打卡",
        },
        options: [
          { label: { en_US: "Work shift (1)", zh_Hans: "上下班打卡 (1)" }, value: "1" },
          { label: { en_US: "Outgoing (2)", zh_Hans: "外出打卡 (2)" }, value: "2" },
          { label: { en_US: "All (3)", zh_Hans: "全部打卡 (3)" }, value: "3" },
        ],
      },
    },
    {
      name: "starttime",
      type: "string",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间（Unix时间戳）",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start Unix timestamp",
          zh_Hans: "开始 Unix 时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "endtime",
      type: "string",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间（Unix时间戳）",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End Unix timestamp",
          zh_Hans: "结束 Unix 时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "userid_list",
      type: "string",
      required: true,
      display_name: {
        en_US: "User IDs",
        zh_Hans: "成员 userid 列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of userids, e.g., [\"user1\",\"user2\"]",
          zh_Hans: "userid 的 JSON 数组，如 [\"user1\",\"user2\"]",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      opencheckindatatype?: string
      starttime?: string
      endtime?: string
      userid_list?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const opencheckindatatype = params.opencheckindatatype?.trim()
    if (!opencheckindatatype) {
      throw new Error("Checkin type is required.")
    }
    const starttimeStr = params.starttime?.trim()
    const endtimeStr = params.endtime?.trim()
    const useridListStr = params.userid_list?.trim()

    if (!starttimeStr || !endtimeStr) {
      throw new Error("Start time and end time are required.")
    }
    if (!useridListStr) {
      throw new Error("User IDs are required.")
    }

    const starttime = parseInt(starttimeStr, 10)
    const endtime = parseInt(endtimeStr, 10)
    if (isNaN(starttime) || isNaN(endtime)) {
      throw new Error("Start time and end time must be valid numbers.")
    }

    let useridlist: string[] = []
    try {
      useridlist = JSON.parse(useridListStr)
      if (!Array.isArray(useridlist)) {
        throw new Error("Userid list must be an array.")
      }
    } catch {
      throw new Error("Userid list must be a valid JSON array.")
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
      opencheckindatatype: parseInt(opencheckindatatype, 10),
      starttime,
      endtime,
      useridlist,
    }

    const data = await wechatWorkPostJson<CheckinDataResponse>(
      "/checkin/getcheckindata",
      token,
      body,
    )

    const result: {
      errcode?: number
      errmsg?: string
      checkindata?: Array<{
        userid?: string
        groupname?: string
        checkin_type?: string
        checkin_time?: number
        exception_type?: string
        location_title?: string
        location_detail?: string
        wifiname?: string
        wifimac?: string
        notes?: string
        lat?: number
        lng?: number
        deviceid?: string
        sch_checkin_time?: number
        groupid?: number
        schedule_id?: number
        mediaids?: string[]
      }>
    } = { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }

    if (data.checkindata) {
      result.checkindata = data.checkindata
    }

    return result
  },
}