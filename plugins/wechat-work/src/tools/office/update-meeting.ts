import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types";
import { z } from "zod";
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client";
import updateMeetingSkill from "./update-meeting-skill.md" with { type: "text" };

const settingsSchema = z.object({
  password: z.string().optional().describe("入会密码，仅可输入4-6位纯数字"),
  enable_waiting_room: z
    .boolean()
    .optional()
    .describe("是否开启等候室，默认不开"),
  allow_enter_before_host: z
    .boolean()
    .optional()
    .describe("是否允许成员在主持人进会前加入，默认允许"),
  remind_scope: z
    .number()
    .optional()
    .describe(
      "来电提醒方式。1-不提醒；2-仅主持人；3-所有成员；4-指定部分人。默认提醒所有成员",
    ),
  enable_enter_mute: z
    .number()
    .optional()
    .describe("入会静音。1-开启；0-关闭；2-超过6人自动开启。默认2"),
  enable_screen_watermark: z
    .boolean()
    .optional()
    .describe("是否开启屏幕水印，默认不开启"),
  hosts: z
    .object({
      userid: z.array(z.string()).optional(),
    })
    .optional()
    .describe("会议主持人列表，最多10个"),
  ring_users: z
    .object({
      userid: z.array(z.string()).optional(),
    })
    .optional()
    .describe("指定响铃的成员列表，remind_scope=4时有效"),
});

const remindersSchema = z.object({
  is_repeat: z
    .number()
    .optional()
    .describe("是否是周期性会议，1-周期性；0-非周期性。默认为0"),
  repeat_type: z
    .number()
    .optional()
    .describe(
      "周期性会议重复类型，0-每天；1-每周；2-每月；7-每个工作日。默认为0",
    ),
  repeat_until: z
    .number()
    .optional()
    .describe(
      "重复结束时刻。每天/工作日/每周最多重复200次；每两周/每月最多重复50次",
    ),
  repeat_interval: z
    .number()
    .optional()
    .describe("重复间隔，目前仅repeat_type=1时支持，且值不能大于2"),
  remind_before: z
    .array(z.number())
    .optional()
    .describe(
      "会议开始前多久提醒（秒）。支持：0-会议开始时提醒；300-5分钟前；900-15分钟前；3600-一小时前；86400-一天前",
    ),
});

const updateMeetingBodySchema = z.object({
  meetingid: z.string().describe("会议ID，仅允许修改预约状态下的会议"),
  title: z.string().optional().describe("会议标题，最多40字节或20个utf8字符"),
  meeting_start: z
    .number()
    .optional()
    .describe(
      "会议开始时间的Unix时间戳，需大于当前时间。修改时须同时指定meeting_duration",
    ),
  meeting_duration: z
    .number()
    .optional()
    .describe(
      "会议持续时间（秒），最小300秒，最大86399秒。修改时须同时指定meeting_start",
    ),
  description: z
    .string()
    .optional()
    .describe("会议描述，最多500个字节或utf8字符"),
  location: z.string().optional().describe("会议地点，最多128个字符"),
  remind_time: z
    .number()
    .optional()
    .describe("会议开始前多久提醒成员（秒），默认0"),
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
  cal_id: z
    .string()
    .optional()
    .describe("会议所属日历ID，不多于64字节。第三方应用必须指定"),
  settings: settingsSchema.optional().describe("会议配置"),
  reminders: remindersSchema.optional().describe("重复会议相关配置"),
});

type UpdateMeetingResponse = {
  errcode?: number;
  errmsg?: string;
  excess_users?: string[];
};

export const updateMeetingTool: ToolDefinition = {
  name: "wechat-work-update-meeting",
  display_name: {
    en_US: "Modify scheduled meeting",
    zh_Hans: "修改预约会议",
  },
  description: {
    en_US:
      "Modify an existing scheduled meeting in WeChat Work via POST /meeting/update. Only meetings in scheduled status can be modified.",
    zh_Hans: "修改企业微信中已有的预约会议。仅允许修改预约状态下的会议。",
  },
  skill: updateMeetingSkill,
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
• meetingid (required, string): meeting ID, only scheduled meetings can be modified
• title (optional, string): title, max 40 bytes or 20 utf8 chars
• meeting_start (optional, uint32): start time, Unix timestamp. Must also specify meeting_duration
• meeting_duration (optional, uint32): duration in seconds, 300-86399. Must also specify meeting_start
• description (optional, string): description, max 500 bytes
• location (optional, string): location, max 128 chars
• remind_time (optional, uint32): remind seconds before meeting_start, default 0
• agentid (optional, uint32): agent ID for legacy third-party suites
• invitees (optional, obj): { userid: string[] }, max 100/300
• cal_id (optional, string): calendar ID, max 64 bytes
• settings (optional, obj): password, enable_waiting_room, allow_enter_before_host, remind_scope, enable_enter_mute, enable_screen_watermark, hosts, ring_users
• reminders (optional, obj): is_repeat, repeat_type, repeat_until, repeat_interval, remind_before`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• meetingid（必填，string）：会议ID，仅允许修改预约状态下的会议
• title（选填，string）：会议标题，最多40字节或20个utf8字符
• meeting_start（选填，uint32）：会议开始时间的Unix时间戳，需大于当前时间。修改时须同时指定meeting_duration
• meeting_duration（选填，uint32）：会议持续时间（秒），最小300秒，最大86399秒。修改时须同时指定meeting_start
• description（选填，string）：会议描述，最多500个字节或utf8字符
• location（选填，string）：会议地点，最多128个字符
• remind_time（选填，uint32）：会议开始前多久提醒成员（秒），默认为0
• agentid（选填，uint32）：授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数
• invitees（选填，obj）：邀请参会成员 { userid: string[] }，普通企业最多100人，付费企业最多300人
• cal_id（选填，string）：会议所属日历ID，不多于64字节
• settings（选填，obj）：会议配置
  • password（string）：入会密码，4-6位纯数字
  • enable_waiting_room（bool）：是否开启等候室，默认不开
  • allow_enter_before_host（bool）：是否允许主持人前加入，默认允许
  • remind_scope（uint32）：来电提醒。1-不提醒；2-仅提醒主持人；3-提醒所有成员；4-指定部分人响铃
  • enable_enter_mute（uint32）：入会静音。1-开启；0-关闭；2-超过6人自动开启
  • enable_screen_watermark（bool）：是否开启屏幕水印，默认不开启
  • hosts（obj）：会议主持人 { userid: string[] }，最多10个
  • ring_users（obj）：指定响铃成员 { userid: string[] }
• reminders（选填，obj）：重复会议相关配置
  • is_repeat（uint32）：是否周期性会议。1-是；0-否
  • repeat_type（uint32）：重复类型。0-每天；1-每周；2-每月；7-每个工作日
  • repeat_until（uint32）：重复结束时刻
  • repeat_interval（uint32）：重复间隔，仅repeat_type=1时支持
  • remind_before（uint32[]）：会议前提醒秒数。支持：0/300/900/3600/86400`,
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string;
      body?: string;
    };
    const credentialId = params.wechat_work_credential;
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。");
    }

    const bodyStr = typeof params.body === "string" ? params.body.trim() : "";
    if (!bodyStr) {
      throw new Error("请求包体 (body) 不能为空。");
    }

    let rawBody: unknown;
    try {
      rawBody = JSON.parse(bodyStr);
    } catch {
      throw new Error("请求包体不是合法的 JSON 格式。");
    }

    const parsed = updateMeetingBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new Error(`请求包体校验失败: ${issues}`);
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    );
    const token = cred.access_token;
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。");
    }

    const body = parsed.data as Record<string, unknown>;

    const data = await wechatWorkPostJson<UpdateMeetingResponse>(
      "/meeting/update",
      token,
      body,
    );
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      excess_users: data.excess_users ?? [],
    };
  },
};
