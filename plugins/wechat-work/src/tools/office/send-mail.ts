import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import sendMailSkill from "./send-mail-skill.md" with { type: "text" }

const recipientSchema = z
  .object({
    emails: z.array(z.string()).optional(),
    userids: z.array(z.string()).optional(),
  })
  .refine((v) => (v.emails?.length ?? 0) + (v.userids?.length ?? 0) > 0, {
    message: "emails 和 userids 至少传一个",
  })

const attachmentItemSchema = z.object({
  file_name: z.string().describe("文件名"),
  content: z
    .string()
    .describe("文件内容（base64编码），所有附件加正文的大小不允许超过50M, 且附件个数不能超过200个"),
})

const sendMailBodySchema = z.object({
  to: recipientSchema.describe("收件人，to.emails 和 to.userids 至少传一个"),
  cc: z
    .object({
      emails: z.array(z.string()).optional(),
      userids: z.array(z.string()).optional(),
    })
    .optional()
    .describe("抄送"),
  bcc: z
    .object({
      emails: z.array(z.string()).optional(),
      userids: z.array(z.string()).optional(),
    })
    .optional()
    .describe("密送"),
  subject: z.string().describe("标题"),
  content: z.string().describe("内容"),
  attachment_list: z
    .array(attachmentItemSchema)
    .max(200)
    .optional()
    .describe("附件相关"),
  content_type: z
    .enum(["html", "text"])
    .default("html")
    .optional()
    .describe("内容类型 html，text（默认是html）"),
  enable_id_trans: z
    .union([z.literal(0), z.literal(1)])
    .default(0)
    .optional()
    .describe(
      "表示是否开启id转译，0表示否，1表示是，默认0。仅第三方应用需要用到，企业自建应用可以忽略",
    ),
})

type SendMailResponse = {
  errcode?: number
  errmsg?: string
}

export const sendMailTool: ToolDefinition = {
  name: "wechat-work-send-mail",
  display_name: {
    en_US: "Send email",
    zh_Hans: "发送普通邮件",
  },
  description: {
    en_US:
      "Send an email via WeChat Work email service, with support for attachments.",
    zh_Hans: "通过企业微信邮件服务发送普通邮件，支持附件能力。",
  },
  skill: sendMailSkill,
  icon: "📧",
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
          en_US: `JSON object for the email. Fields:
• to (required, obj): { emails?: string[], userids?: string[] } — at least one of emails/userids required
• cc (optional, obj): { emails?: string[], userids?: string[] }
• bcc (optional, obj): { emails?: string[], userids?: string[] }
• subject (required, string): title
• content (required, string): email body
• attachment_list (optional, obj[]): [{ file_name: string, content: string (base64) }], max 200, total ≤ 50MB
• content_type (optional, string): "html" | "text", default "html"
• enable_id_trans (optional, uint32): 0 or 1, default 0`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• to（必填，obj）：收件人 { emails?: string[], userids?: string[] }，to.emails 和 to.userids 至少传一个
• cc（选填，obj）：抄送 { emails?: string[], userids?: string[] }
• bcc（选填，obj）：密送 { emails?: string[], userids?: string[] }
• subject（必填，string）：标题
• content（必填，string）：内容
• attachment_list（选填，obj[]）：附件 [{ file_name: string, content: string（base64编码）}]，所有附件加正文不超过50M，附件不超过200个
• content_type（选填，string）：内容类型 html 或 text（默认是html）
• enable_id_trans（选填，uint32）：是否开启id转译，0表示否，1表示是，默认0`,
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

    const parsed = sendMailBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<SendMailResponse>(
      "/exmail/app/compose_send",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
