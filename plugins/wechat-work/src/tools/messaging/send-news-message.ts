import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import sendNewsMessageSkill from "./send-news-message-skill.md" with {
  type: "text",
}

const articleSchema = z.object({
  title: z
    .string()
    .describe("标题，不超过128个字节，超过会自动截断（支持id转译）"),
  description: z
    .string()
    .optional()
    .describe("描述，不超过512个字节，超过会自动截断（支持id转译）"),
  url: z
    .string()
    .optional()
    .describe(
      "点击后跳转的链接。最长2048字节，请确保包含了协议头(http/https)，小程序或者url必须填写一个",
    ),
  picurl: z
    .string()
    .optional()
    .describe(
      "图文消息的图片链接，最长2048字节，支持JPG、PNG格式，较好的效果为大图1068*455，小图150*150",
    ),
  appid: z
    .string()
    .optional()
    .describe(
      "小程序appid，必须是与当前应用关联的小程序，appid和pagepath必须同时填写，填写后会忽略url字段",
    ),
  pagepath: z
    .string()
    .optional()
    .describe(
      "点击消息卡片后的小程序页面，最长128字节，仅限本小程序内的页面。appid和pagepath必须同时填写，填写后会忽略url字段",
    ),
})

const sendNewsMessageBodySchema = z.object({
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
  msgtype: z.literal("news").describe("消息类型，此时固定为：news"),
  agentid: z
    .number()
    .int()
    .describe("企业应用的id，整型。企业内部开发，可在应用的设置页面查看"),
  news: z.object({
    articles: z
      .array(articleSchema)
      .min(1)
      .max(8)
      .describe("图文消息，一个图文消息支持1到8条图文"),
  }),
  enable_id_trans: z
    .union([z.literal(0), z.literal(1)])
    .optional()
    .describe("表示是否开启id转译，0表示否，1表示是，默认0"),
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

export const sendNewsMessageTool: ToolDefinition = {
  name: "wechat-work-send-news-message",
  display_name: {
    en_US: "Send app news message",
    zh_Hans: "发送应用图文消息",
  },
  description: {
    en_US:
      "Send a news/article message to members via a self-built application.",
    zh_Hans: "通过自建应用向成员发送图文消息（应用消息推送）。",
  },
  skill: sendNewsMessageSkill,
  icon: "📰",
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
          en_US: `JSON object for the news message. Fields:
• touser (optional, string): Recipient userids separated by '|', max 1000. Use "@all" for all members
• toparty (optional, string): Department IDs separated by '|', max 100
• totag (optional, string): Tag IDs separated by '|', max 100
• msgtype (required, string): Fixed to "news"
• agentid (required, int): Application agent ID
• news (required, obj): { articles: obj[] } — 1 to 8 articles, each with:
  - title (required, string): Title, max 128 bytes
  - description (optional, string): Description, max 512 bytes
  - url (optional, string): Click URL, max 2048 bytes
  - picurl (optional, string): Image URL, supports JPG/PNG
  - appid (optional, string): Mini program appid
  - pagepath (optional, string): Mini program page path
• enable_id_trans (optional, int): 0=no (default), 1=yes
• enable_duplicate_check (optional, int): 0=no (default), 1=yes
• duplicate_check_interval (optional, int): Interval in seconds, default 1800, max 14400`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• touser（选填，string）：成员ID列表（多个接收者用'|'分隔，最多支持1000个）。指定为"@all"则向全部成员发送
• toparty（选填，string）：部门ID列表，多个接收者用'|'分隔，最多支持100个
• totag（选填，string）：标签ID列表，多个接收者用'|'分隔，最多支持100个
• msgtype（必填，string）：消息类型，固定为 "news"
• agentid（必填，int）：企业应用的id
• news（必填，obj）：{ articles: obj[] } — 图文消息，一个图文消息支持1到8条图文，每条包含：
  - title（必填，string）：标题，不超过128个字节，超过会自动截断
  - description（选填，string）：描述，不超过512个字节，超过会自动截断
  - url（选填，string）：点击后跳转的链接，最长2048字节
  - picurl（选填，string）：图文消息的图片链接，支持JPG、PNG格式，大图1068*455，小图150*150
  - appid（选填，string）：小程序appid，必须是与当前应用关联的小程序
  - pagepath（选填，string）：点击消息卡片后的小程序页面，最长128字节
• enable_id_trans（选填，int）：表示是否开启id转译，0表示否，1表示是，默认0
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

    const parsed = sendNewsMessageBodySchema.safeParse(rawBody)
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
