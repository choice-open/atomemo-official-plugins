import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import sendKfMessageSkill from "./send-kf-message-skill.md" with { type: "text" }

const sendKfMessageBodySchema = z.object({
  touser: z.string().describe("指定接收消息的客户UserID"),
  open_kfid: z.string().describe("指定发送消息的客服账号ID"),
  msgid: z
    .string()
    .max(32)
    .optional()
    .describe("指定消息ID，不多于32字节，取值范围：[0-9a-zA-Z_-]*"),
  msgtype: z
    .enum([
      "text",
      "image",
      "voice",
      "video",
      "file",
      "link",
      "miniprogram",
      "msgmenu",
      "location",
      "ca_link",
    ])
    .describe("消息类型"),
  text: z
    .object({ content: z.string().describe("消息内容，最长不超过2048个字节") })
    .optional()
    .describe("文本消息，msgtype=text时必填"),
  image: z
    .object({ media_id: z.string().describe("图片文件id") })
    .optional()
    .describe("图片消息，msgtype=image时必填"),
  voice: z
    .object({ media_id: z.string().describe("语音文件id") })
    .optional()
    .describe("语音消息，msgtype=voice时必填"),
  video: z
    .object({ media_id: z.string().describe("视频媒体文件id") })
    .optional()
    .describe("视频消息，msgtype=video时必填"),
  file: z
    .object({ media_id: z.string().describe("文件id") })
    .optional()
    .describe("文件消息，msgtype=file时必填"),
  link: z
    .object({
      title: z.string().describe("标题，不超过128个字节"),
      desc: z.string().optional().describe("描述，不超过512个字节"),
      url: z.string().describe("点击后跳转的链接，最长2048字节"),
      thumb_media_id: z.string().describe("缩略图的media_id"),
    })
    .optional()
    .describe("图文链接消息，msgtype=link时必填"),
  miniprogram: z
    .object({
      appid: z.string().describe("小程序appid"),
      title: z.string().optional().describe("小程序消息标题，最多64个字节"),
      thumb_media_id: z.string().describe("小程序消息封面的mediaid"),
      pagepath: z.string().describe("点击消息卡片后进入的小程序页面路径"),
    })
    .optional()
    .describe("小程序消息，msgtype=miniprogram时必填"),
  msgmenu: z
    .object({
      head_content: z.string().optional().describe("起始文本，不多于1024字节"),
      list: z.array(z.record(z.string(), z.unknown())).optional().describe("菜单项配置"),
      tail_content: z.string().optional().describe("结束文本，不多于1024字节"),
    })
    .optional()
    .describe("菜单消息，msgtype=msgmenu时必填"),
  location: z
    .object({
      name: z.string().optional().describe("位置名"),
      address: z.string().optional().describe("地址详情说明"),
      latitude: z.number().describe("纬度，范围为90~-90"),
      longitude: z.number().describe("经度，范围为180~-180"),
    })
    .optional()
    .describe("地理位置消息，msgtype=location时必填"),
  ca_link: z
    .object({
      link_url: z.string().describe("通过获客助手创建的获客链接"),
    })
    .optional()
    .describe("获客链接消息，msgtype=ca_link时必填"),
})

type SendKfMessageResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
}

export const sendKfMessageTool: ToolDefinition = {
  name: "wechat-work-send-kf-message",
  display_name: {
    en_US: "Send customer service message",
    zh_Hans: "发送消息",
  },
  description: {
    en_US:
      "Send a message via WeChat customer service. Supports text, image, voice, video, file, link, miniprogram, menu, location, and customer acquisition link.",
    zh_Hans:
      "当微信客户处于「新接入待处理」或「由智能助手接待」状态下，可调用该接口给用户发送消息。支持发送文本、图片、语音、视频、文件、图文、小程序、菜单消息、地理位置、获客链接。",
  },
  skill: sendKfMessageSkill,
  icon: "💬",
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
• touser (required, string): Customer UserID
• open_kfid (required, string): Customer service account ID
• msgid (optional, string): Message ID, max 32 bytes
• msgtype (required, string): text|image|voice|video|file|link|miniprogram|msgmenu|location|ca_link
• text (obj): { content: string } — for text messages
• image/voice/video/file (obj): { media_id: string }
• link (obj): { title, desc?, url, thumb_media_id }
• miniprogram (obj): { appid, title?, thumb_media_id, pagepath }
• msgmenu (obj): { head_content?, list?: obj[], tail_content? }
• location (obj): { name?, address?, latitude, longitude }
• ca_link (obj): { link_url }`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• touser（必填，string）：指定接收消息的客户UserID
• open_kfid（必填，string）：指定发送消息的客服账号ID
• msgid（选填，string）：指定消息ID，不多于32字节
• msgtype（必填，string）：消息类型 text|image|voice|video|file|link|miniprogram|msgmenu|location|ca_link
• text（obj）：文本消息 { content: string }，最长不超过2048个字节
• image/voice/video/file（obj）：{ media_id: string }
• link（obj）：图文链接 { title, desc?, url, thumb_media_id }
• miniprogram（obj）：小程序 { appid, title?, thumb_media_id, pagepath }
• msgmenu（obj）：菜单消息 { head_content?, list?: obj[], tail_content? }
• location（obj）：地理位置 { name?, address?, latitude, longitude }
• ca_link（obj）：获客链接 { link_url }`,
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

    const parsed = sendKfMessageBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<SendKfMessageResponse>(
      "/kf/send_msg",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      msgid: data.msgid ?? "",
    }
  },
}
