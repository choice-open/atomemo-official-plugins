import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import createCalendarSkill from "./create-calendar-skill.md" with { type: "text" }

const createCalendarBodySchema = z.object({
  calendar: z.object({
    admins: z
      .array(z.string())
      .max(3)
      .optional()
      .describe("日历的管理员userid列表，管理员必须在通知范围成员的列表中。最多指定3人"),
    set_as_default: z
      .union([z.literal(0), z.literal(1)])
      .optional()
      .describe("是否将该日历设置为应用的默认日历。0-否；1-是。默认为0。第三方应用不支持"),
    summary: z
      .string()
      .min(1)
      .max(128)
      .describe("日历标题。1~128字符"),
    color: z
      .string()
      .describe('日历在终端上显示的颜色，RGB颜色编码16进制表示，例如："#0000FF"'),
    description: z
      .string()
      .max(512)
      .optional()
      .describe("日历描述。0~512字符"),
    is_public: z
      .union([z.literal(0), z.literal(1)])
      .optional()
      .describe("是否公共日历。0-否；1-是。每个人最多可创建或订阅100个公共日历"),
    public_range: z.object({
      userids: z.array(z.string()).optional().describe("公开的成员列表范围，最多1000个成员"),
      partyids: z.array(z.number()).optional().describe("公开的部门列表范围，最多100个部门"),
    }).optional().describe("公开范围，仅当是公共日历时有效"),
    is_corp_calendar: z
      .union([z.literal(0), z.literal(1)])
      .optional()
      .describe("是否全员日历。0-否；1-是。每个企业最多20个全员日历"),
    shares: z.array(z.object({
      userid: z.string().describe("日历通知范围成员的id"),
      permission: z.number().optional().describe("权限：1-可查看 3-仅查看闲忙状态"),
    })).optional().describe("日历通知范围成员列表。最多2000人"),
  }).describe("日历信息"),
  agentid: z.number().optional().describe("授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数"),
})

type CreateCalendarResponse = {
  errcode?: number
  errmsg?: string
  cal_id?: string
  fail_result?: {
    shares?: Array<{
      errcode: number
      errmsg: string
      userid: string
    }>
  }
}

export const createCalendarTool: ToolDefinition = {
  name: "wechat-work-create-calendar",
  display_name: {
    en_US: "Create calendar",
    zh_Hans: "创建日历",
  },
  description: {
    en_US: "Create a new calendar in WeChat Work.",
    zh_Hans: "该接口用于通过应用在企业内创建一个日历。",
  },
  skill: createCalendarSkill,
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
• calendar (required, obj): Calendar info
  - summary (required, string): Title, 1-128 chars
  - color (required, string): RGB hex color, e.g. "#FF3030"
  - description (optional, string): Description, 0-512 chars
  - admins (optional, string[]): Admin userids, max 3, must be in shares
  - set_as_default (optional, int): 0=no, 1=yes, default 0
  - is_public (optional, int): 0=no, 1=yes
  - public_range (optional, obj): { userids?: string[], partyids?: int[] }
  - is_corp_calendar (optional, int): 0=no, 1=yes
  - shares (optional, obj[]): [{ userid, permission? }], max 2000. permission: 1=view, 3=busy/free
• agentid (optional, int): For legacy third-party multi-app suites only`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• calendar（必填，obj）：日历信息
  - summary（必填，string）：日历标题，1~128字符
  - color（必填，string）：日历颜色，RGB颜色编码16进制，如 "#FF3030"
  - description（选填，string）：日历描述，0~512字符
  - admins（选填，string[]）：管理员userid列表，最多3人，必须在通知范围成员中
  - set_as_default（选填，int）：是否设为默认日历，0-否 1-是，默认0。第三方应用不支持
  - is_public（选填，int）：是否公共日历，0-否 1-是。每人最多100个公共日历
  - public_range（选填，obj）：公开范围 { userids?: string[]（最多1000）, partyids?: int[]（最多100） }
  - is_corp_calendar（选填，int）：是否全员日历，0-否 1-是。每企业最多20个
  - shares（选填，obj[]）：通知范围成员 [{ userid, permission? }]，最多2000人。permission: 1-可查看 3-仅查看闲忙
• agentid（选填，int）：仅旧的第三方多应用套件需要填`,
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

    const parsed = createCalendarBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<CreateCalendarResponse>(
      "/oa/calendar/add",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      cal_id: data.cal_id ?? "",
      fail_result: data.fail_result ?? {},
    }
  },
}
