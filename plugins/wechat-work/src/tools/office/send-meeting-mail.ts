import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import sendMeetingMailSkill from "./send-meeting-mail-skill.md" with { type: "text" }

const recipientSchema = z
  .object({
    emails: z.array(z.string()).optional(),
    userids: z.array(z.string()).optional(),
  })
  .refine((v) => (v.emails?.length ?? 0) + (v.userids?.length ?? 0) > 0, {
    message: "emails 和 userids 至少传一个",
  })

const remindersSchema = z.object({
  is_remind: z.union([z.literal(0), z.literal(1)]).optional().describe("是否有提醒 0-不提醒 1-提醒"),
  remind_before_event_mins: z.number().optional().describe("会议开始前多少分钟提醒，当is_remind=1时有效"),
  timezone: z.number().min(-12).max(12).optional().describe("时区，UTC偏移量，默认东八区"),
  is_repeat: z.union([z.literal(0), z.literal(1)]).optional().describe("是否重复 0-否 1-是"),
  is_custom_repeat: z.union([z.literal(0), z.literal(1)]).optional().describe("是否自定义重复 0-否 1-是"),
  repeat_type: z.number().optional().describe("重复类型：0-每日 1-每周 2-每月 5-每年"),
  repeat_interval: z.number().optional().describe("重复间隔"),
  repeat_day_of_week: z.array(z.number()).optional().describe("每周周几重复，取值1~7"),
  repeat_day_of_month: z.array(z.number()).optional().describe("每月哪几天重复，取值1~31"),
  repeat_month_of_year: z.array(z.number()).optional().describe("每年哪几个月重复，取值1~12"),
  repeat_until: z.number().optional().describe("重复结束时刻，Unix时间戳"),
})

const sendMeetingMailBodySchema = z.object({
  to: recipientSchema.describe("收件人，to.emails 和 to.userids 至少传一个"),
  cc: z.object({
    emails: z.array(z.string()).optional(),
    userids: z.array(z.string()).optional(),
  }).optional().describe("抄送"),
  bcc: z.object({
    emails: z.array(z.string()).optional(),
    userids: z.array(z.string()).optional(),
  }).optional().describe("密送"),
  subject: z.string().describe("邮件标题，同时也是会议标题"),
  content: z.string().describe("邮件正文，同时是会议描述"),
  attachment_list: z.array(z.object({
    file_name: z.string().describe("文件名"),
    content: z.string().describe("文件内容（base64编码）"),
  })).max(200).optional().describe("附件，所有附件加正文不超过50M，附件不超过200个"),
  content_type: z.enum(["html", "text"]).default("html").optional().describe("内容类型 html，text（默认是html）"),
  schedule: z.object({
    schedule_id: z.string().optional().describe("会议ID，修改/取消会议必须带上"),
    method: z.enum(["request", "cancel"]).default("request").optional().describe("会议方法：request-请求（默认），cancel-取消会议"),
    location: z.string().optional().describe("地点"),
    start_time: z.number().describe("会议开始时间，Unix时间戳"),
    end_time: z.number().describe("会议结束时间，Unix时间戳"),
    reminders: remindersSchema.optional().describe("重复和提醒相关字段"),
  }).describe("会议相关数据，发会议邮件必填"),
  meeting: z.object({
    hosts: z.object({
      userids: z.array(z.string()).optional(),
    }).optional().describe("会议主持人列表，最多10个，只支持填userid"),
    meeting_admins: z.object({
      userids: z.array(z.string()),
    }).describe("会议管理员，仅可指定1人，只支持传userid"),
    option: z.object({
      password: z.string().optional().describe("入会密码，仅可输入4-6位纯数字"),
      auto_record: z.number().optional().describe("是否自动录制 0-未开启 1-本地录制 2-云录制"),
      enable_waiting_room: z.boolean().optional().describe("是否开启等候室"),
      allow_enter_before_host: z.boolean().optional().describe("是否允许成员在主持人进会前加入"),
      enter_restraint: z.number().optional().describe("是否限制成员入会 0-所有人 2-仅企业内部"),
      enable_screen_watermark: z.boolean().optional().describe("是否开启屏幕水印"),
      enable_enter_mute: z.number().optional().describe("成员入会时是否静音 0-关闭 1-开启 2-超6人自动"),
      remind_scope: z.number().optional().describe("会议开始时是否提醒 1-不提醒 2-仅主持人 3-所有成员"),
      water_mark_type: z.number().optional().describe("水印类型 0-单排 1-多排"),
    }).optional().describe("会议相关设置"),
  }).optional().describe("会议相关，会议邮件必填"),
  enable_id_trans: z.union([z.literal(0), z.literal(1)]).default(0).optional().describe("是否开启id转译，0-否 1-是，默认0"),
})

type SendMeetingMailResponse = {
  errcode?: number
  errmsg?: string
}

export const sendMeetingMailTool: ToolDefinition = {
  name: "wechat-work-send-meeting-mail",
  display_name: {
    en_US: "Send meeting mail",
    zh_Hans: "发送会议邮件",
  },
  description: {
    en_US: "Send a meeting email via WeChat Work email service.",
    zh_Hans: "通过企业微信邮件服务发送会议邮件。",
  },
  skill: sendMeetingMailSkill,
  icon: "🏢",
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
          en_US: `JSON object for the meeting email. Fields:
• to (required, obj): { emails?: string[], userids?: string[] } — at least one required
• cc (optional, obj): { emails?: string[], userids?: string[] }
• bcc (optional, obj): { emails?: string[], userids?: string[] }
• subject (required, string): email/meeting title
• content (required, string): email body / meeting description
• attachment_list (optional, obj[]): [{ file_name, content (base64) }], max 200, total ≤ 50MB
• content_type (optional, string): "html" | "text", default "html"
• schedule (required, obj): meeting schedule data
  - schedule_id (optional, string): required for modify/cancel
  - method (optional, string): "request" | "cancel", default "request"
  - location (optional, string): location
  - start_time (required, int): Unix timestamp
  - end_time (required, int): Unix timestamp
  - reminders (optional, obj): { is_remind, remind_before_event_mins, timezone, is_repeat, ... }
• meeting (required for meeting mail, obj):
  - hosts (optional, obj): { userids: string[] }, max 10
  - meeting_admins (required, obj): { userids: string[] }, exactly 1
  - option (optional, obj): { password, auto_record, enable_waiting_room, allow_enter_before_host, enter_restraint, enable_screen_watermark, enable_enter_mute, remind_scope, water_mark_type }
• enable_id_trans (optional, uint32): 0 or 1, default 0`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• to（必填，obj）：收件人 { emails?: string[], userids?: string[] }，至少传一个
• cc（选填，obj）：抄送 { emails?: string[], userids?: string[] }
• bcc（选填，obj）：密送 { emails?: string[], userids?: string[] }
• subject（必填，string）：邮件标题，同时也是会议标题
• content（必填，string）：邮件正文，同时是会议描述
• attachment_list（选填，obj[]）：附件 [{ file_name, content（base64编码）}]，不超过200个
• content_type（选填，string）：内容类型 html 或 text（默认html）
• schedule（必填，obj）：会议相关数据
  - schedule_id（选填，string）：会议ID，修改/取消会议必须带上
  - method（选填，string）：request-请求（默认），cancel-取消会议
  - location（选填，string）：地点
  - start_time（必填，int）：会议开始时间，Unix时间戳
  - end_time（必填，int）：会议结束时间，Unix时间戳
  - reminders（选填，obj）：{ is_remind, remind_before_event_mins, timezone, is_repeat, is_custom_repeat, repeat_type, repeat_interval, repeat_day_of_week, repeat_day_of_month, repeat_month_of_year, repeat_until }
• meeting（会议邮件必填，obj）：
  - hosts（选填，obj）：会议主持人 { userids: string[] }，最多10个
  - meeting_admins（必填，obj）：会议管理员 { userids: string[] }，仅可指定1人
  - option（选填，obj）：{ password（4-6位数字）, auto_record（0/1/2）, enable_waiting_room, allow_enter_before_host, enter_restraint（0/2）, enable_screen_watermark, enable_enter_mute（0/1/2）, remind_scope（1/2/3）, water_mark_type（0/1） }
• enable_id_trans（选填，uint32）：是否开启id转译，0-否 1-是，默认0`,
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

    const parsed = sendMeetingMailBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<SendMeetingMailResponse>(
      "/exmail/app/compose_send",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
