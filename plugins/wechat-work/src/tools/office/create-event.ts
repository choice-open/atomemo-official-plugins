import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import createEventSkill from "./create-event-skill.md" with { type: "text" }

const attendeeSchema = z.object({
  userid: z.string().describe("日程参与者ID，不多于64字节"),
})

const remindersSchema = z.object({
  is_remind: z.number().optional().describe("是否需要提醒。0-否；1-是"),
  remind_before_event_secs: z
    .number()
    .optional()
    .describe(
      "日程开始前多少秒提醒，is_remind为1时有效。支持：0/300/900/3600/86400",
    ),
  remind_time_diffs: z
    .array(z.number())
    .optional()
    .describe(
      "提醒时间与开始时间的差值（秒），is_remind为1时有效，可指定多个。与remind_before_event_secs仅一个生效",
    ),
  is_repeat: z.number().optional().describe("是否重复日程。0-否；1-是"),
  repeat_type: z
    .number()
    .optional()
    .describe("重复类型，is_repeat为1时有效。0-每日；1-每周；2-每月；5-每年；7-工作日"),
  repeat_until: z
    .number()
    .optional()
    .describe("重复结束时刻，Unix时间戳，is_repeat为1时有效。不填或填0表示一直重复"),
  is_custom_repeat: z
    .number()
    .optional()
    .describe("是否自定义重复。0-否；1-是。is_repeat为1时有效"),
  repeat_interval: z
    .number()
    .optional()
    .describe("重复间隔，仅当自定义重复时有效"),
  repeat_day_of_week: z
    .array(z.number())
    .optional()
    .describe("每周周几重复，取值1~7，仅自定义重复且按周时有效"),
  repeat_day_of_month: z
    .array(z.number())
    .optional()
    .describe("每月哪几天重复，取值1~31，仅自定义重复且按月时有效"),
  timezone: z
    .number()
    .optional()
    .describe("时区，UTC偏移量（小时），默认北京时间+8，取值-12~+12"),
})

const createEventBodySchema = z.object({
  schedule: z.object({
    admins: z
      .array(z.string())
      .optional()
      .describe("日程管理员userid列表，管理员必须在共享成员列表中，最多3人"),
    start_time: z.number().describe("日程开始时间，Unix时间戳"),
    end_time: z.number().describe("日程结束时间，Unix时间戳"),
    is_whole_day: z
      .number()
      .optional()
      .describe("是否设置为全天日程。0-否；1-是"),
    attendees: z
      .array(attendeeSchema)
      .optional()
      .describe("日程参与者列表，最多1000人"),
    summary: z
      .string()
      .optional()
      .describe('日程标题，0~128字符，不填默认显示为"新建事件"'),
    description: z
      .string()
      .optional()
      .describe("日程描述，不多于1000个字符"),
    reminders: remindersSchema.optional().describe("提醒相关信息"),
    location: z.string().optional().describe("日程地址，不多于128个字符"),
    cal_id: z
      .string()
      .optional()
      .describe(
        "日程所属日历ID，不填则插入到应用默认日历。第三方应用必须指定。不多于64字节",
      ),
  }),
  agentid: z
    .number()
    .optional()
    .describe("授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数"),
})

type CreateEventResponse = {
  errcode?: number
  errmsg?: string
  schedule_id?: string
}

export const createEventTool: ToolDefinition = {
  name: "wechat-work-create-event",
  display_name: {
    en_US: "Create schedule",
    zh_Hans: "创建日程",
  },
  description: {
    en_US:
      "Create a new schedule in a WeChat Work calendar via POST /oa/schedule/add.",
    zh_Hans: "在企业微信日历中创建一个日程。",
  },
  skill: createEventSkill,
  icon: "📅",
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
      name: "body",
      type: "string",
      required: true,
      display_name: {
        en_US: "Request body (JSON)",
        zh_Hans: "请求包体 (JSON)",
      },
      ui: {
        component: "code-editor",
        hint: {
          en_US: `JSON object. Fields:
• schedule (required, obj): schedule info
  • schedule.admins (optional, string[]): admin userid list, max 3
  • schedule.start_time (required, uint32): start time, Unix timestamp
  • schedule.end_time (required, uint32): end time, Unix timestamp
  • schedule.is_whole_day (optional, uint32): all-day event. 0=no; 1=yes
  • schedule.attendees (optional, obj[]): attendee list, max 1000. Each: { userid: string }
  • schedule.summary (optional, string): title, 0-128 chars. Default "新建事件"
  • schedule.description (optional, string): description, max 1000 chars
  • schedule.reminders (optional, obj): reminder settings
    • is_remind (0/1), remind_before_event_secs (0/300/900/3600/86400)
    • remind_time_diffs (int32[]), is_repeat (0/1), repeat_type (0/1/2/5/7)
    • repeat_until, is_custom_repeat (0/1), repeat_interval
    • repeat_day_of_week (1-7), repeat_day_of_month (1-31), timezone (-12~+12)
  • schedule.location (optional, string): location, max 128 chars
  • schedule.cal_id (optional, string): calendar ID, max 64 bytes
• agentid (optional, uint32): agent ID for legacy third-party suites`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• schedule（必填，obj）：日程信息
  • schedule.admins（选填，string[]）：日程管理员userid列表，管理员必须在共享成员列表中，最多3人
  • schedule.start_time（必填，uint32）：日程开始时间，Unix时间戳
  • schedule.end_time（必填，uint32）：日程结束时间，Unix时间戳
  • schedule.is_whole_day（选填，uint32）：是否设置为全天日程。0-否；1-是
  • schedule.attendees（选填，obj[]）：日程参与者列表，最多1000人。每项 { userid: string }
  • schedule.summary（选填，string）：日程标题，0~128字符，不填默认显示为"新建事件"
  • schedule.description（选填，string）：日程描述，不多于1000个字符
  • schedule.reminders（选填，obj）：提醒相关信息
    • is_remind（int32）：是否需要提醒。0-否；1-是
    • remind_before_event_secs（uint32）：日程开始前多少秒提醒，is_remind=1时有效。支持：0/300/900/3600/86400
    • remind_time_diffs（int32[]）：提醒时间与开始时间差值，可指定多个，与remind_before_event_secs仅一个生效
    • is_repeat（int32）：是否重复日程。0-否；1-是
    • repeat_type（uint32）：重复类型，is_repeat=1时有效。0-每日；1-每周；2-每月；5-每年；7-工作日
    • repeat_until（uint32）：重复结束时刻，Unix时间戳，不填或0表示一直重复
    • is_custom_repeat（uint32）：是否自定义重复。0-否；1-是
    • repeat_interval（uint32）：重复间隔，仅自定义重复时有效
    • repeat_day_of_week（uint32[]）：每周周几重复，取值1~7
    • repeat_day_of_month（uint32[]）：每月哪几天重复，取值1~31
    • timezone（uint32）：时区UTC偏移量，默认8（北京时间），取值-12~+12
  • schedule.location（选填，string）：日程地址，不多于128个字符
  • schedule.cal_id（选填，string）：日程所属日历ID，不多于64字节。不填则插入应用默认日历，第三方应用必须指定
• agentid（选填，uint32）：授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数`,
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      body?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }

    const bodyStr =
      typeof params.body === "string" ? params.body.trim() : ""
    if (!bodyStr) {
      throw new Error("请求包体 (body) 不能为空。")
    }

    let rawBody: unknown
    try {
      rawBody = JSON.parse(bodyStr)
    } catch {
      throw new Error("请求包体不是合法的 JSON 格式。")
    }

    const parsed = createEventBodySchema.safeParse(rawBody)
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")
      throw new Error(`请求包体校验失败: ${issues}`)
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const body = parsed.data as Record<string, unknown>

    const data = await wechatWorkPostJson<CreateEventResponse>(
      "/oa/schedule/add",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      schedule_id: data.schedule_id ?? "",
    }
  },
}
