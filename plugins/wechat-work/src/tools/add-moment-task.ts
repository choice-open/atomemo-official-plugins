import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import addMomentTaskSkill from "./add-moment-task-skill.md" with { type: "text" }

type AddMomentTaskResponse = {
  errcode?: number
  errmsg?: string
  jobid?: string
}

export const addMomentTaskTool: ToolDefinition = {
  name: "wechat-work-add-moment-task",
  display_name: {
    en_US: "Add customer moment task",
    zh_Hans: "发布客户朋友圈",
  },
  description: {
    en_US: "Create a customer moment (朋友圈) publish task.",
    zh_Hans: "创建客户朋友圈发布任务。",
  },
  skill: addMomentTaskSkill,
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
      name: "text_content",
      type: "string",
      required: false,
      display_name: {
        en_US: "Text content",
        zh_Hans: "文本内容",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Text message content (max 2000 chars)",
          zh_Hans: "文本消息内容（最多2000字）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "msgtype",
      type: "string",
      required: false,
      display_name: {
        en_US: "Attachment type",
        zh_Hans: "附件类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Type of attachment",
          zh_Hans: "附件类型",
        },
        options: [
          { label: "Image", value: "image" },
          { label: "Video", value: "video" },
          { label: "Link", value: "link" },
        ],
      },
    },
    {
      name: "media_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Media ID",
        zh_Hans: "素材ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID of the attachment",
          zh_Hans: "附件的素材ID",
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
        zh_Hans: "链接标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Title of the link (max 64 chars)",
          zh_Hans: "图文消息标题（最多64字）",
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
        zh_Hans: "链接地址",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "URL of the link",
          zh_Hans: "图文消息链接",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "user_list",
      type: "string",
      required: false,
      display_name: {
        en_US: "Sender user list",
        zh_Hans: "发送者用户列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated list of user IDs",
          zh_Hans: "发送者用户ID列表（逗号分隔）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "department_list",
      type: "string",
      required: false,
      display_name: {
        en_US: "Sender department list",
        zh_Hans: "发送者部门列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated list of department IDs",
          zh_Hans: "发送者部门ID列表（逗号分隔）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "external_contact_tag_list",
      type: "string",
      required: false,
      display_name: {
        en_US: "External contact tag list",
        zh_Hans: "客户标签列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated list of external contact tag IDs",
          zh_Hans: "可见客户标签ID列表（逗号分隔）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      text_content?: string
      msgtype?: string
      media_id?: string
      link_title?: string
      link_url?: string
      user_list?: string
      department_list?: string
      external_contact_tag_list?: string
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

    const textContent = params.text_content?.trim()
    if (textContent) {
      body.text = { content: textContent }
    }

    const msgtype = params.msgtype?.trim()
    const mediaId = params.media_id?.trim()
    if (msgtype && mediaId) {
      const attachment: Record<string, unknown> = {
        msgtype,
      }
      if (msgtype === "image" || msgtype === "video") {
        attachment[msgtype] = { media_id: mediaId }
      } else if (msgtype === "link") {
        const linkTitle = params.link_title?.trim() || ""
        const linkUrl = params.link_url?.trim()
        if (linkUrl) {
          attachment[msgtype] = {
            title: linkTitle,
            url: linkUrl,
            media_id: mediaId,
          }
        }
      }
      body.attachments = [attachment]
    }

    const visibleRange: Record<string, unknown> = {}
    const userListStr = params.user_list?.trim()
    if (userListStr) {
      visibleRange.sender_list = {
        user_list: userListStr.split(",").map((s) => s.trim()).filter(Boolean),
      }
    }

    const deptListStr = params.department_list?.trim()
    if (deptListStr) {
      if (!visibleRange.sender_list) {
        visibleRange.sender_list = {}
      }
      ;(visibleRange.sender_list as Record<string, unknown>).department_list =
        deptListStr.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
    }

    const tagListStr = params.external_contact_tag_list?.trim()
    if (tagListStr) {
      visibleRange.external_contact_list = {
        tag_list: tagListStr.split(",").map((s) => s.trim()).filter(Boolean),
      }
    }

    if (Object.keys(visibleRange).length > 0) {
      body.visible_range = visibleRange
    }

    if (!body.text && !body.attachments) {
      throw new Error("Either text_content or (msgtype + media_id) is required.")
    }

    const data = await wechatWorkPostJson<AddMomentTaskResponse>(
      "/externalcontact/add_moment_task",
      token,
      body,
    )
    return {
      jobid: data.jobid ?? "",
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "",
    }
  },
}
