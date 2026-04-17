import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import sendWelcomeMessageSkill from "./send-welcome-message-skill.md" with { type: "text" }

const sendWelcomeMessageBodySchema = z.object({
  welcome_code: z
    .string()
    .describe("通过添加外部联系人事件推送给企业的发送欢迎语的凭证，有效期为20秒"),
  text: z
    .object({ content: z.string().describe("消息文本内容，最长为4000字节") })
    .optional()
    .describe("文本消息"),
  attachments: z
    .array(z.any())
    .max(9)
    .optional()
    .describe("附件，最多可添加9个附件"),
})

type SendWelcomeMsgResponse = {
  errcode?: number
  errmsg?: string
}

export const sendWelcomeMessageTool: ToolDefinition = {
  name: "wechat-work-send-welcome-message",
  display_name: {
    en_US: "Send welcome message to new customer",
    zh_Hans: "发送新客户欢迎语",
  },
  description: {
    en_US: "Send a personalized welcome message to newly added customers via the welcome_code.",
    zh_Hans: "企业微信在向企业推送添加外部联系人事件时，会额外返回一个welcome_code，企业以此为凭据调用接口，即可通过成员向新添加的客户发送个性化的欢迎语。",
  },
  skill: sendWelcomeMessageSkill,
  icon: "👋",
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
• welcome_code (required, string): welcome code from add external contact event, valid for 20 seconds
• text (optional, obj): { content: string }, max 4000 bytes
• attachments (optional, obj[]): max 9, supports image/link/miniprogram/video/file
Note: text and attachments cannot both be empty`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• welcome_code（必填，string）：通过添加外部联系人事件推送给企业的发送欢迎语的凭证，有效期为20秒
• text（选填，obj）：文本消息 { content: string }，最长为4000字节
• attachments（选填，obj[]）：附件，最多可添加9个附件，支持image/link/miniprogram/video/file
注意：text和attachments不能同时为空`,
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

    const parsed = sendWelcomeMessageBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<SendWelcomeMsgResponse>(
      "/externalcontact/send_welcome_msg",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
