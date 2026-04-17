import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import createMeetingSkill from "./create-meeting-skill.md" with { type: "text" }

const guestSchema = z.object({
  area: z.string().describe("国家/地区代码，如中国传86"),
  phone_number: z.string().describe("手机号"),
  guest_name: z.string().optional().describe("会议嘉宾姓名，1~16位字符"),
})

const settingsSchema = z.object({
  password: z.string().optional().describe("入会密码，仅可输入4-6位纯数字"),
  enable_waiting_room: z.boolean().optional().describe("是否开启等候室，默认不开"),
  allow_enter_before_host: z
    .boolean()
    .optional()
    .describe("是否允许成员在主持人进会前加入，默认允许"),
  enable_enter_mute: z
    .number()
    .optional()
    .describe("成员入会时静音。1-开启；0-关闭；2-超过6人自动开启。默认2"),
  allow_unmute_self: z
    .boolean()
    .optional()
    .describe("允许参会者取消静音，默认允许"),
  mute_all: z
    .boolean()
    .optional()
    .describe("是否设置全体静音，需配合allow_unmute_self=false使用"),
  allow_external_user: z
    .boolean()
    .optional()
    .describe("是否允许外部成员入会，默认允许"),
  enable_screen_watermark: z
    .boolean()
    .optional()
    .describe("是否开启屏幕水印，默认不开启"),
  watermark_type: z.number().optional().describe("水印样式。0-单排；1-多排。默认单排"),
  auto_record_type: z
    .string()
    .optional()
    .describe("自动录制类型。none-禁用；local-本地录制；cloud-云录制"),
  attendee_join_auto_record: z
    .boolean()
    .optional()
    .describe("有参会成员入会时立即开启云录制，需auto_record_type=cloud"),
  enable_host_pause_auto_record: z
    .boolean()
    .optional()
    .describe("允许主持人暂停或停止云录制，需auto_record_type=cloud"),
  enable_interpreter: z.boolean().optional().describe("同声传译开关，默认不开启"),
  enable_enroll: z.boolean().optional().describe("是否激活报名"),
  enable_host_key: z.boolean().optional().describe("是否开启主持人密钥，默认不开启"),
  host_key: z
    .string()
    .optional()
    .describe("主持人密钥，仅支持6位数字。开启后不填将自动分配"),
  hosts: z
    .object({
      userid: z.array(z.string()).optional(),
    })
    .optional()
    .describe("会议主持人列表，最多10个。需购买高级功能"),
  remind_scope: z
    .number()
    .optional()
    .describe(
      "来电提醒方式。1-不提醒；2-仅主持人；3-所有成员；4-指定部分人。默认仅主持人",
    ),
  ring_users: z
    .object({
      userid: z.array(z.string()).optional(),
    })
    .optional()
    .describe("指定响铃的成员列表，remind_scope=4时有效"),
})

const remindersSchema = z.object({
  is_repeat: z
    .number()
    .optional()
    .describe("是否是周期性会议。1-周期性；0-非周期性。默认0"),
  repeat_type: z
    .number()
    .optional()
    .describe("周期性会议类型，is_repeat=1时有效。0-每日；1-每周；2-每月；7-工作日"),
  is_custom_repeat: z
    .number()
    .optional()
    .describe("是否自定义重复设置，is_repeat=1时生效。0-否；1-是"),
  repeat_interval: z
    .number()
    .optional()
    .describe("重复间隔，自定义重复时必填"),
  repeat_day_of_week: z
    .array(z.number())
    .optional()
    .describe("每周周几重复，取值1~7，自定义按周时有效"),
  repeat_day_of_month: z
    .array(z.number())
    .optional()
    .describe("每月哪几天重复，取值1~31，自定义按月时有效"),
  repeat_until_type: z
    .number()
    .optional()
    .describe("结束重复类型。0-按日期结束；1-按次数结束。默认0"),
  repeat_until_count: z
    .number()
    .optional()
    .describe("周期会议限定次数。每天/工作日/每周最多200场，每月最多50场。默认7次"),
  repeat_until: z
    .number()
    .optional()
    .describe("周期会议结束时刻，repeat_until_type=0时有效。默认当前+7天"),
  remind_before: z
    .array(z.number())
    .optional()
    .describe("会议开始前多久提醒（秒）。支持：0/300/900/3600/86400。默认不提醒"),
})

const createMeetingBodySchema = z.object({
  admin_userid: z.string().describe("会议管理员userid"),
  title: z.string().describe("会议标题，1~255位字符"),
  meeting_start: z
    .number()
    .optional()
    .describe("会议开始时间的Unix时间戳，需大于当前时间"),
  meeting_duration: z
    .number()
    .optional()
    .describe("会议持续时间（秒），最小300秒，最大86399秒"),
  description: z
    .string()
    .optional()
    .describe("会议描述，最多500个字节或utf8字符"),
  location: z
    .string()
    .optional()
    .describe("会议地点，最长18个汉字或36个英文字母"),
  agentid: z
    .number()
    .optional()
    .describe("授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数"),
  invitees: z
    .object({
      userid: z.array(z.string()).optional(),
    })
    .optional()
    .describe("邀请参会成员，普通企业最多100人，付费企业最多300人"),
  guests: z.array(guestSchema).optional().describe("会议嘉宾列表"),
  settings: settingsSchema.optional().describe("会议配置"),
  cal_id: z
    .string()
    .optional()
    .describe("会议所属日历ID，不多于64字节。第三方应用必须指定"),
  reminders: remindersSchema.optional().describe("周期性相关配置"),
})

type CreateMeetingResponse = {
  errcode?: number
  errmsg?: string
  meetingid?: string
  excess_users?: string[]
  meeting_code?: string
  meeting_link?: string
}

export const createMeetingTool: ToolDefinition = {
  name: "wechat-work-create-meeting",
  display_name: {
    en_US: "Create scheduled meeting",
    zh_Hans: "创建预约会议",
  },
  description: {
    en_US:
      "Create a new scheduled meeting in WeChat Work via POST /meeting/create.",
    zh_Hans: "在企业微信中创建一个预约会议。",
  },
  skill: createMeetingSkill,
  icon: "📹",
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
• admin_userid (required, string): meeting admin userid
• title (required, string): title, 1-255 chars
• meeting_start (optional, uint32): start time, Unix timestamp, must > now
• meeting_duration (optional, uint32): duration in seconds, 300-86399
• description (optional, string): description, max 500 bytes
• location (optional, string): location, max 18 CN chars or 36 EN letters
• agentid (optional, uint32): agent ID for legacy third-party suites
• invitees (optional, obj): { userid: string[] }, max 100/300
• guests (optional, obj[]): [{ area, phone_number, guest_name? }]
• settings (optional, obj): password, enable_waiting_room, allow_enter_before_host, enable_enter_mute, allow_unmute_self, mute_all, allow_external_user, enable_screen_watermark, watermark_type, auto_record_type, hosts, remind_scope, ring_users, etc.
• cal_id (optional, string): calendar ID, max 64 bytes
• reminders (optional, obj): is_repeat, repeat_type, is_custom_repeat, repeat_interval, repeat_day_of_week, repeat_day_of_month, repeat_until_type, repeat_until_count, repeat_until, remind_before`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• admin_userid（必填，string）：会议管理员userid
• title（必填，string）：会议标题，1~255位字符
• meeting_start（选填，uint32）：会议开始时间的Unix时间戳，需大于当前时间
• meeting_duration（选填，uint32）：会议持续时间（秒），最小300秒，最大86399秒
• description（选填，string）：会议描述，最多500个字节或utf8字符
• location（选填，string）：会议地点，最长18个汉字或36个英文字母
• agentid（选填，uint32）：授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数
• invitees（选填，obj）：邀请参会成员 { userid: string[] }，普通企业最多100人，付费企业最多300人
• guests（选填，obj[]）：会议嘉宾列表 [{ area: string, phone_number: string, guest_name?: string }]
• settings（选填，obj）：会议配置
  • password（string）：入会密码，4-6位纯数字
  • enable_waiting_room（bool）：是否开启等候室，默认不开
  • allow_enter_before_host（bool）：是否允许主持人前加入，默认允许
  • enable_enter_mute（uint32）：入会静音。1-开启；0-关闭；2-超过6人自动开启
  • allow_unmute_self（bool）：允许参会者取消静音
  • mute_all（bool）：全体静音，需配合allow_unmute_self=false
  • allow_external_user（bool）：是否允许外部成员入会，默认允许
  • enable_screen_watermark（bool）：是否开启屏幕水印
  • watermark_type（uint32）：水印样式。0-单排；1-多排
  • auto_record_type（string）：自动录制。none/local/cloud
  • attendee_join_auto_record（bool）：有人入会时立即云录制
  • enable_host_pause_auto_record（bool）：允许主持人暂停云录制
  • enable_interpreter（bool）：同声传译开关
  • enable_enroll（bool）：是否激活报名
  • enable_host_key（bool）：是否开启主持人密钥
  • host_key（string）：主持人密钥，6位数字
  • hosts（obj）：会议主持人 { userid: string[] }，最多10个
  • remind_scope（uint32）：来电提醒。1-不提醒；2-仅主持人；3-所有成员；4-指定部分人
  • ring_users（obj）：指定响铃成员 { userid: string[] }
• cal_id（选填，string）：会议所属日历ID，不多于64字节
• reminders（选填，obj）：周期性相关配置
  • is_repeat（uint32）：是否周期性会议。1-是；0-否
  • repeat_type（uint32）：重复类型。0-每日；1-每周；2-每月；7-工作日
  • is_custom_repeat（uint32）：是否自定义重复。0-否；1-是
  • repeat_interval（uint32）：重复间隔
  • repeat_day_of_week（uint32[]）：每周周几重复，取值1~7
  • repeat_day_of_month（uint32[]）：每月哪几天重复，取值1~31
  • repeat_until_type（uint32）：结束类型。0-按日期；1-按次数
  • repeat_until_count（uint32）：限定次数
  • repeat_until（uint32）：结束时刻
  • remind_before（uint32[]）：会议前提醒秒数。支持：0/300/900/3600/86400`,
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

    const parsed = createMeetingBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<CreateMeetingResponse>(
      "/meeting/create",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      meetingid: data.meetingid ?? "",
      excess_users: data.excess_users ?? [],
      meeting_code: data.meeting_code ?? "",
      meeting_link: data.meeting_link ?? "",
    }
  },
}
