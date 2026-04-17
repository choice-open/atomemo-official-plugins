import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { z } from "zod"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../../wechat-work/client"
import addWelcomeTemplateSkill from "./add-welcome-template-skill.md" with { type: "text" }

const addWelcomeTemplateBodySchema = z.object({
  text: z
    .object({ content: z.string().describe("消息文本内容，最长为3000字节") })
    .optional()
    .describe("文本消息，支持%NICKNAME%占位符"),
  image: z
    .object({
      media_id: z.string().optional().describe("图片的media_id，可以通过素材管理接口获得"),
      pic_url: z.string().optional().describe("图片的链接，仅可使用上传图片接口得到的链接"),
    })
    .optional()
    .describe("图片消息"),
  link: z
    .object({
      title: z.string().describe("图文消息标题，最长为128字节"),
      picurl: z.string().optional().describe("图文消息封面的url"),
      desc: z.string().optional().describe("图文消息的描述，最长为512字节"),
      url: z.string().describe("图文消息的链接"),
    })
    .optional()
    .describe("图文消息"),
  miniprogram: z
    .object({
      title: z.string().describe("小程序消息标题，最长为64字节"),
      pic_media_id: z.string().describe("小程序消息封面的mediaid，封面图建议尺寸为520*416"),
      appid: z.string().describe("小程序appid，必须是关联到企业的小程序应用"),
      page: z.string().describe("小程序page路径"),
    })
    .optional()
    .describe("小程序消息"),
  file: z
    .object({
      media_id: z.string().describe("文件id，可以通过素材管理、异步上传临时素材接口获得"),
    })
    .optional()
    .describe("文件消息"),
  video: z
    .object({
      media_id: z.string().describe("视频媒体文件id，可以通过素材管理、异步上传临时素材接口获得"),
    })
    .optional()
    .describe("视频消息"),
  agentid: z.number().int().optional().describe("授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数"),
  notify: z
    .union([z.literal(0), z.literal(1)])
    .optional()
    .describe("是否通知成员将这条入群欢迎语应用到客户群中，0-不通知，1-通知，不填则通知"),
})

type AddWelcomeTemplateResponse = {
  errcode?: number
  errmsg?: string
  template_id?: string
}

export const addWelcomeTemplateTool: ToolDefinition = {
  name: "wechat-work-add-welcome-template",
  display_name: {
    en_US: "Add group welcome template",
    zh_Hans: "添加入群欢迎语素材",
  },
  description: {
    en_US: "Add a welcome message template to the enterprise group welcome template library.",
    zh_Hans: "企业可通过此API向企业的入群欢迎语素材库中添加素材。每个企业的入群欢迎语素材库中，最多容纳100个素材。",
  },
  skill: addWelcomeTemplateSkill,
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
          en_US: `JSON object. Fields:
• text (optional, obj): { content: string }, max 3000 bytes, supports %NICKNAME% placeholder
• image (optional, obj): { media_id?: string, pic_url?: string }
• link (optional, obj): { title: string, picurl?: string, desc?: string, url: string }
• miniprogram (optional, obj): { title: string, pic_media_id: string, appid: string, page: string }
• file (optional, obj): { media_id: string }
• video (optional, obj): { media_id: string }
• agentid (optional, int): only for legacy third-party multi-app suites
• notify (optional, int): 0=don't notify, 1=notify (default)
Note: text + at most one of image/link/miniprogram/file/video`,
          zh_Hans: `请求包体 JSON 对象，字段说明：
• text（选填，obj）：{ content: string } 消息文本内容，最长为3000字节，支持%NICKNAME%占位符
• image（选填，obj）：{ media_id?: string, pic_url?: string } 图片消息
• link（选填，obj）：{ title: string, picurl?: string, desc?: string, url: string } 图文消息
• miniprogram（选填，obj）：{ title: string, pic_media_id: string, appid: string, page: string } 小程序消息
• file（选填，obj）：{ media_id: string } 文件消息
• video（选填，obj）：{ media_id: string } 视频消息
• agentid（选填，int）：授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数
• notify（选填，int）：是否通知成员将这条入群欢迎语应用到客户群中，0-不通知，1-通知，不填则通知
注意：text以外的消息类型只能有一个，按image、link、miniprogram、file、video优先顺序取参`,
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

    const parsed = addWelcomeTemplateBodySchema.safeParse(rawBody)
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

    const data = await wechatWorkPostJson<AddWelcomeTemplateResponse>(
      "/externalcontact/group_welcome_template/add",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      template_id: data.template_id ?? "",
    }
  },
}
