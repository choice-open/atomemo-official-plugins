import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import sendFamilyMessageSkill from "./send-family-message-skill.md" with {
  type: "text",
}

type SendFamilyMessageResponse = {
  errcode?: number
  errmsg?: string
  msgid?: string
  invaliduser?: string
}

export const sendFamilyMessageTool: ToolDefinition = {
  name: "wechat-work-send-family-message",
  display_name: {
    en_US: "Send family/education message",
    zh_Hans: "发送家校消息",
  },
  description: {
    en_US:
      "Send a text message to parents/students via the education/parenting interface.",
    zh_Hans: "通过家校接口向家长/学生发送文本消息。",
  },
  skill: sendFamilyMessageSkill,
  icon: "🏫",
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
      name: "school_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "School ID",
        zh_Hans: "学校 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The school ID from the education management console",
          zh_Hans: "家校管理后台获取的学校ID",
        },
        width: "full",
      },
    },
    {
      name: "agent_id",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Agent ID",
        zh_Hans: "应用 AgentId",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The numeric agent id of your education app",
          zh_Hans: "家校应用的 AgentId",
        },
      },
    },
    {
      name: "touser",
      type: "string",
      required: true,
      display_name: {
        en_US: "To users (userid)",
        zh_Hans: "接收成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            "Pipe-separated userids, e.g., zhangsan|lisi. For family messages, this is typically parent or student userid.",
          zh_Hans: "成员 userid，多个用 | 分隔，家校消息中一般为家长或学生userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "content",
      type: "string",
      required: true,
      display_name: {
        en_US: "Message content",
        zh_Hans: "消息内容",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Message text (max 2048 bytes)",
          zh_Hans: "消息内容，最长不超过2048字节",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      school_id?: string
      agent_id?: number
      touser?: string
      content?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const touser = params.touser?.trim()
    const content = params.content?.trim()
    const schoolId = params.school_id?.trim()
    if (!touser) {
      throw new Error("touser is required.")
    }
    if (!content) {
      throw new Error("content is required.")
    }
    if (!schoolId) {
      throw new Error("school_id is required.")
    }
    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.")
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
      msgtype: "text",
      agentid: params.agent_id,
      school_id: schoolId,
      text: { content },
      touser: touser,
    }

    const data = await wechatWorkPostJson<SendFamilyMessageResponse>(
      "/message/send",
      token,
      body,
    )
    return {
      msgid: data.msgid ?? null,
      invaliduser: data.invaliduser ?? "",
    }
  },
}
