import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import updateCalendarSkill from "./update-calendar-skill.md" with { type: "text" }

const updateCalendarBodySchema = z.object({
  skip_public_range: z
    .union([z.literal(0), z.literal(1)])
    .optional()
    .describe("是否不更新可订阅范围。0-否；1-是。默认为0"),
  calendar: z.object({
    cal_id: z.string().describe("日历ID"),
    admins: z
      .array(z.string())
      .max(3)
      .optional()
      .describe("日历的管理员userid列表。最多指定3人"),
    summary: z
      .string()
      .min(1)
      .max(128)
      .describe("日历标题。1~128字符"),
    color: z
      .string()
      .describe('日历颜色，RGB颜色编码16进制表示，例如："#0000FF"'),
    description: z
      .string()
      .max(512)
      .optional()
      .describe("日历描述。0~512字符"),
    public_range: z.object({
      userids: z.array(z.string()).optional().describe("公开的成员列表范围，最多1000个成员"),
      partyids: z.array(z.number()).optional().describe("公开的部门列表范围，最多100个部门"),
    }).optional().describe("公开范围，仅当是公共日历时有效"),
    shares: z.array(z.object({
      userid: z.string().describe("日历通知范围成员的id"),
      permission: z.number().optional().describe("权限：1-可查看 3-仅查看闲忙状态"),
    })).optional().describe("日历通知范围成员列表。最多2000人"),
  }).describe("日历信息"),
})

type UpdateCalendarResponse = {
  errcode?: number
  errmsg?: string
  fail_result?: {
    shares?: Array<{
      errcode: number
      errmsg: string
      userid: string
    }>
  }
}

export const updateCalendarTool: ToolDefinition = {
  name: "wechat-work-update-calendar",
  display_name: {
    en_US: "Update calendar",
    zh_Hans: "更新日历",
  },
  description: {
    en_US:
      "Update an existing calendar in WeChat Work. Note: this is a full replacement, not incremental update.",
    zh_Hans:
      "修改指定日历的信息。注意，更新操作是覆盖式，而不是增量式。",
  },
  skill: updateCalendarSkill,
  icon: "✏️",
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
• skip_public_range (optional, int): 0=update public range (default), 1=skip
• calendar (required, obj): Calendar info
  - cal_id (required, string): Calendar ID
  - summary (required, string): Title, 1-128 chars
  - color (required, string): RGB hex color, e.g. "#FF3030"
  - description (optional, string): Description, 0-512 chars
  - admins (optional, string[]): Admin userids, max 3
  - public_range (optional, obj): { userids?: string[], partyids?: int[] }
  - shares (optional, obj[]): [{ userid, permission? }], max 2000. permission: 1=view, 3=busy/free`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• skip_public_range（选填，int）：是否不更新可订阅范围，0-否（默认） 1-是
• calendar（必填，obj）：日历信息
  - cal_id（必填，string）：日历ID
  - summary（必填，string）：日历标题，1~128字符
  - color（必填，string）：日历颜色，RGB颜色编码16进制，如 "#FF3030"
  - description（选填，string）：日历描述，0~512字符
  - admins（选填，string[]）：管理员userid列表，最多3人
  - public_range（选填，obj）：公开范围 { userids?: string[]（最多1000）, partyids?: int[]（最多100） }
  - shares（选填，obj[]）：通知范围成员 [{ userid, permission? }]，最多2000人。permission: 1-可查看 3-仅查看闲忙`,
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

    const parsed = updateCalendarBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<UpdateCalendarResponse>(
      "/oa/calendar/update",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      fail_result: data.fail_result ?? {},
    }
  },
}
