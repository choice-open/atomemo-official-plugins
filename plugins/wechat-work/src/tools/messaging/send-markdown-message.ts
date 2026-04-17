import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import sendMarkdownMessageSkill from "./send-markdown-message-skill.md" with {
  type: "text",
}

const sendMarkdownMessageBodySchema = z.object({
  touser: z
    .string()
    .optional()
    .describe(
      "成员ID列表（消息接收者，多个接收者用'|'分隔，最多支持1000个）。特殊情况：指定为@all，则向关注该企业应用的全部成员发送",
    ),
  toparty: z
    .string()
    .optional()
    .describe(
      "部门ID列表，多个接收者用'|'分隔，最多支持100个。当touser为@all时忽略本参数",
    ),
  totag: z
    .string()
    .optional()
    .describe(
      "标签ID列表，多个接收者用'|'分隔，最多支持100个。当touser为@all时忽略本参数",
    ),
  msgtype: z.literal("markdown").describe("消息类型，此时固定为：markdown"),
  agentid: z
    .number()
    .int()
    .describe("企业应用的id，整型。企业内部开发，可在应用的设置页面查看"),
  markdown: z.object({
    content: z
      .string()
      .describe("markdown内容，最长不超过2048个字节，必须是utf8编码"),
  }),
  enable_duplicate_check: z
    .union([z.literal(0), z.literal(1)])
    .optional()
    .describe("表示是否开启重复消息检查，0表示否，1表示是，默认0"),
  duplicate_check_interval: z
    .number()
    .int()
    .optional()
    .describe(
      "表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时",
    ),
})

type SendMessageResponse = {
  errcode?: number
  errmsg?: string
  invaliduser?: string
  invalidparty?: string
  invalidtag?: string
  unlicenseduser?: string
  msgid?: string
  response_code?: string
}

export const sendMarkdownMessageTool: ToolDefinition = {
  name: "wechat-work-send-markdown-message",
  display_name: {
    en_US: "Send app markdown message",
    zh_Hans: "发送应用Markdown消息",
  },
  description: {
    en_US:
      "Send a markdown message to members via a self-built application.",
    zh_Hans: "通过自建应用向成员发送Markdown消息（应用消息推送）。",
  },
  skill: sendMarkdownMessageSkill,
  icon: "📝",
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
          en_US: `JSON object for the markdown message. Fields:
• touser (optional, string): Recipient userids separated by '|', max 1000. Use "@all" for all members
• toparty (optional, string): Department IDs separated by '|', max 100
• totag (optional, string): Tag IDs separated by '|', max 100
• msgtype (required, string): Fixed to "markdown"
• agentid (required, int): Application agent ID
• markdown (required, obj): { content: string } — markdown content, max 2048 bytes, must be UTF-8
• enable_duplicate_check (optional, int): 0=no (default), 1=yes
• duplicate_check_interval (optional, int): Interval in seconds, default 1800, max 14400`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• touser（选填，string）：成员ID列表（多个接收者用'|'分隔，最多支持1000个）。指定为"@all"则向全部成员发送
• toparty（选填，string）：部门ID列表，多个接收者用'|'分隔，最多支持100个
• totag（选填，string）：标签ID列表，多个接收者用'|'分隔，最多支持100个
• msgtype（必填，string）：消息类型，固定为 "markdown"
• agentid（必填，int）：企业应用的id
• markdown（必填，obj）：{ content: string } — markdown内容，最长不超过2048个字节，必须是utf8编码
• enable_duplicate_check（选填，int）：表示是否开启重复消息检查，0表示否，1表示是，默认0
• duplicate_check_interval（选填，int）：重复消息检查的时间间隔，默认1800s，最大不超过4小时`,
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

    const parsed = sendMarkdownMessageBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<SendMessageResponse>(
      "/message/send",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      invaliduser: data.invaliduser ?? "",
      invalidparty: data.invalidparty ?? "",
      invalidtag: data.invalidtag ?? "",
      unlicenseduser: data.unlicenseduser ?? "",
      msgid: data.msgid ?? "",
      response_code: data.response_code ?? "",
    }
  },
}
