import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import addContactWaySkill from "./add-contact-way-skill.md" with { type: "text" }

type AddContactWayResponse = {
  errcode?: number
  errmsg?: string
  config_id?: string
}

export const addContactWayTool: ToolDefinition = {
  name: "wechat-work-add-contact-way",
  display_name: {
    en_US: "Add contact way",
    zh_Hans: "配置联系我方式",
  },
  description: {
    en_US: "Configure a contact way for customers to reach your organization.",
    zh_Hans: "配置联系我方式，供客户通过该方式连接到企业。",
  },
  skill: addContactWaySkill,
  icon: "➕",
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
      name: "type",
      type: "string",
      required: true,
      display_name: {
        en_US: "Type",
        zh_Hans: "类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Contact way type",
          zh_Hans: "联系方式类型",
        },
        options: [
          { label: "Single customer (1)", value: "1" },
          { label: "Group chat (2)", value: "2" },
        ],
      },
    },
    {
      name: "scene",
      type: "string",
      required: true,
      display_name: {
        en_US: "Scene",
        zh_Hans: "场景",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Scene for the contact way",
          zh_Hans: "展示场景",
        },
        options: [
          { label: "QR code (1)", value: "1" },
          { label: "Phone (2)", value: "2" },
          { label: "Meeting (3)", value: "3" },
        ],
      },
    },
    {
      name: "style",
      type: "string",
      required: false,
      display_name: {
        en_US: "Style",
        zh_Hans: "样式",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Style (1-9)",
          zh_Hans: "样式，1-9",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "remark",
      type: "string",
      required: false,
      display_name: {
        en_US: "Remark",
        zh_Hans: "备注",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Remark for this contact way",
          zh_Hans: "联系方式备注",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "question_list",
      type: "string",
      required: false,
      display_name: {
        en_US: "Question list (JSON array)",
        zh_Hans: "问答列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of {question, answer}, e.g. [{\"question\":\"xxx\",\"answer\":\"yyy\"}]",
          zh_Hans: "问答JSON数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "contact_user",
      type: "string",
      required: false,
      display_name: {
        en_US: "Contact users (JSON array)",
        zh_Hans: "接待人员 userid 列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of userids for customer service",
          zh_Hans: "接待人员userid数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "contact_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Contact type",
        zh_Hans: "接待方式",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "How customers can contact",
          zh_Hans: "客户添加方式",
        },
        options: [
          { label: "By user (1)", value: "1" },
          { label: "By phone (2)", value: "2" },
        ],
      },
    },
    {
      name: "skip_verify",
      type: "string",
      required: false,
      display_name: {
        en_US: "Skip verification",
        zh_Hans: "无需验证",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Whether to skip customer verification",
          zh_Hans: "是否无需验证",
        },
        options: [
          { label: "Yes (Recommended)", value: "true" },
          { label: "No", value: "false" },
        ],
      },
    },
    {
      name: "state",
      type: "string",
      required: false,
      display_name: {
        en_US: "Custom state",
        zh_Hans: "自定义state参数",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Custom state parameter",
          zh_Hans: "自定义state参数",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "group_chat_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Group chat ID",
        zh_Hans: "客户群ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Group chat ID for type=2",
          zh_Hans: "客户群ID，用于类型为2时",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "expire_time",
      type: "string",
      required: false,
      display_name: {
        en_US: "Expire time (Unix timestamp)",
        zh_Hans: "过期时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Expiration time as Unix timestamp",
          zh_Hans: "过期时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "add_user_tags",
      type: "string",
      required: false,
      display_name: {
        en_US: "User tags (JSON array)",
        zh_Hans: "标签ID列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of tag IDs to add to users",
          zh_Hans: "用户标签ID数组，用于自动打标签",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      type?: string
      scene?: string
      style?: string
      remark?: string
      question_list?: string
      contact_user?: string
      contact_type?: string
      skip_verify?: string
      state?: string
      group_chat_id?: string
      expire_time?: string
      add_user_tags?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const type = params.type?.trim()
    if (!type) {
      throw new Error("type is required.")
    }

    const scene = params.scene?.trim()
    if (!scene) {
      throw new Error("scene is required.")
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

    const body: Record<string, unknown> = {
      type: parseInt(type, 10),
      scene: parseInt(scene, 10),
    }

    const style = params.style?.trim()
    if (style) body.style = parseInt(style, 10)

    const remark = params.remark?.trim()
    if (remark) body.remark = remark

    const questionListStr = params.question_list?.trim()
    if (questionListStr) {
      try {
        const questionList = JSON.parse(questionListStr)
        if (Array.isArray(questionList)) {
          body.question_list = questionList
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const contactUserStr = params.contact_user?.trim()
    if (contactUserStr) {
      try {
        const contactUser = JSON.parse(contactUserStr)
        if (Array.isArray(contactUser)) {
          body.contact_user = contactUser
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const contactType = params.contact_type?.trim()
    if (contactType) body.contact_type = parseInt(contactType, 10)

    const skipVerify = params.skip_verify?.trim()
    if (skipVerify === "true") body.skip_verify = true
    else if (skipVerify === "false") body.skip_verify = false

    const state = params.state?.trim()
    if (state) body.state = state

    const groupChatId = params.group_chat_id?.trim()
    if (groupChatId) body.group_chat_id = groupChatId

    const expireTime = params.expire_time?.trim()
    if (expireTime) body.expire_time = parseInt(expireTime, 10)

    const addUserTagsStr = params.add_user_tags?.trim()
    if (addUserTagsStr) {
      try {
        const addUserTags = JSON.parse(addUserTagsStr)
        if (Array.isArray(addUserTags)) {
          body.add_user_tags = addUserTags
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const data = await wechatWorkPostJson<AddContactWayResponse>(
      "/externalcontact/add_contact_way",
      token,
      body,
    )
    return { config_id: data.config_id ?? "" }
  },
}