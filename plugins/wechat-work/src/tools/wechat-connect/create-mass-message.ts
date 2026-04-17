import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import createMassMessageSkill from "./create-mass-message-skill.md" with { type: "text" }

const createMassMessageBodySchema = z.object({
  chat_type: z
    .enum(["single", "group"])
    .optional()
    .describe("群发任务的类型，默认为single，表示发送给客户，group表示发送给客户群"),
  external_userid: z
    .array(z.string())
    .optional()
    .describe("客户的externaluserid列表，仅在chat_type为single时有效，最多可一次指定1万个客户"),
  chat_id_list: z
    .array(z.string())
    .optional()
    .describe("客户群id列表，仅在chat_type为group时有效，最多可一次指定2000个客户群"),
  tag_filter: z
    .object({
      group_list: z.array(
        z.object({
          tag_list: z.array(z.string()).describe("标签列表"),
        }),
      ),
    })
    .optional()
    .describe("客户标签筛选条件"),
  sender: z
    .string()
    .optional()
    .describe("发送企业群发消息的成员userid，当类型为发送给客户群时必填"),
  allow_select: z
    .boolean()
    .optional()
    .describe("是否允许成员在待发送客户列表中重新进行选择，默认为false，仅支持客户群发场景"),
  text: z
    .object({ content: z.string().describe("消息文本内容，最多4000个字节") })
    .optional()
    .describe("文本消息"),
  attachments: z
    .array(z.any())
    .max(9)
    .optional()
    .describe("附件，最多支持添加9个附件"),
})

type CreateMassMessageResponse = {
  errcode?: number
  errmsg?: string
  fail_list?: string[]
  msgid?: string
}

export const createMassMessageTool: ToolDefinition = {
  name: "wechat-work-create-mass-message",
  display_name: {
    en_US: "Create mass message to customers",
    zh_Hans: "创建企业群发",
  },
  description: {
    en_US: "Create a mass messaging task to send messages to customers or customer groups.",
    zh_Hans: "企业跟第三方应用可通过此接口添加企业群发消息的任务并通知成员发送给相关客户或客户群。",
  },
  skill: createMassMessageSkill,
  icon: "📤",
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
• chat_type (optional, string): "single" (default) or "group"
• external_userid (optional, string[]): max 10000, only for single
• chat_id_list (optional, string[]): max 2000, only for group
• tag_filter (optional, obj): { group_list: [{ tag_list: string[] }] }
• sender (optional, string): required when chat_type is group
• allow_select (optional, bool): default false
• text (optional, obj): { content: string }, max 4000 bytes
• attachments (optional, obj[]): max 9 items (image/link/miniprogram/video/file)`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• chat_type（选填，string）：群发任务的类型，默认为single，表示发送给客户，group表示发送给客户群
• external_userid（选填，string[]）：客户的externaluserid列表，仅在chat_type为single时有效，最多1万个
• chat_id_list（选填，string[]）：客户群id列表，仅在chat_type为group时有效，最多2000个
• tag_filter（选填，obj）：标签筛选 { group_list: [{ tag_list: string[] }] }，同组按或关系，不同组按且关系
• sender（选填，string）：发送企业群发消息的成员userid，当类型为发送给客户群时必填
• allow_select（选填，bool）：是否允许成员在待发送客户列表中重新进行选择，默认为false
• text（选填，obj）：文本消息 { content: string }，最多4000个字节
• attachments（选填，obj[]）：附件，最多9个，支持image/link/miniprogram/video/file
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

    const parsed = createMassMessageBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<CreateMassMessageResponse>(
      "/externalcontact/add_msg_template",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      fail_list: data.fail_list ?? [],
      msgid: data.msgid ?? "",
    }
  },
}
