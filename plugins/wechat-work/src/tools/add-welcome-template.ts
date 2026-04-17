import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"

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
    en_US: "Add a welcome message template for customer groups.",
    zh_Hans: "向企业的入群欢迎语素材库中添加素材。",
  },
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
      name: "content",
      type: "string",
      required: false,
      display_name: {
        en_US: "Text content",
        zh_Hans: "文本内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Text content, supports %NICKNAME% placeholder. Max 3000 bytes",
          zh_Hans: "文本内容，支持%NICKNAME%占位符，最多3000字节",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "link_title",
      type: "string",
      required: false,
      display_name: {
        en_US: "Link title",
        zh_Hans: "图文消息标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Title of the link message, max 128 bytes",
          zh_Hans: "图文消息标题，最多128字节",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "link_url",
      type: "string",
      required: false,
      display_name: {
        en_US: "Link URL",
        zh_Hans: "图文消息链接",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Link URL of the link message",
          zh_Hans: "图文消息的链接",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "link_picurl",
      type: "string",
      required: false,
      display_name: {
        en_US: "Link cover image URL",
        zh_Hans: "图文消息封面URL",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Cover image URL of the link message",
          zh_Hans: "图文消息封面的URL",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "link_desc",
      type: "string",
      required: false,
      display_name: {
        en_US: "Link description",
        zh_Hans: "图文消息描述",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Description of the link message, max 512 bytes",
          zh_Hans: "图文消息的描述，最多512字节",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "media_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Media ID (image/video/file)",
        zh_Hans: "媒体文件ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID from material upload for image/video/file",
          zh_Hans: "素材上传获得的media_id，用于图片/视频/文件",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "notify",
      type: "string",
      required: false,
      display_name: {
        en_US: "Notify members",
        zh_Hans: "通知成员",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether to notify members to apply the template",
          zh_Hans: "是否通知成员将这条入群欢迎语应用到客户群中",
        },
        options: [
          { label: { en_US: "Notify (default)", zh_Hans: "通知（默认）" }, value: "1" },
          { label: { en_US: "Do not notify", zh_Hans: "不通知" }, value: "0" },
        ],
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      content?: string
      link_title?: string
      link_url?: string
      link_picurl?: string
      link_desc?: string
      media_id?: string
      notify?: string
    }

    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error(
        "Wechat work credential is missing or has no access_token.",
      )
    }

    const body: Record<string, unknown> = {}

    const content = params.content?.trim()
    if (content) {
      body.text = { content }
    }

    const linkTitle = params.link_title?.trim()
    const linkUrl = params.link_url?.trim()
    if (linkTitle && linkUrl) {
      body.link = {
        title: linkTitle,
        url: linkUrl,
      }
      if (params.link_picurl?.trim()) {
        body.link.picurl = params.link_picurl.trim()
      }
      if (params.link_desc?.trim()) {
        body.link.desc = params.link_desc.trim()
      }
    }

    const mediaId = params.media_id?.trim()
    if (mediaId) {
      body.image = { media_id: mediaId }
    }

    const notify = params.notify?.trim()
    if (notify) body.notify = parseInt(notify, 10)

    if (!content && !linkTitle && !mediaId) {
      throw new Error("At least one of content, link_title, or media_id is required.")
    }

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
