import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createGroupChatSkill from "./create-group-chat-skill.md" with {
  type: "text",
}

type CreateGroupChatResponse = {
  errcode?: number
  errmsg?: string
  chat_id?: string
}

export const createGroupChatTool: ToolDefinition = {
  name: "wechat-work-create-group-chat",
  display_name: {
    en_US: "Create automated group chat",
    zh_Hans: "创建群聊",
  },
  description: {
    en_US:
      "Create a group chat via smartsheet automation (智能表格自动化创群).",
    zh_Hans: "通过智能表格自动化创建群聊。",
  },
  skill: createGroupChatSkill,
  icon: "👥",
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
      name: "scene",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Group chat scene",
        zh_Hans: "群聊场景",
      },
      ui: {
        component: "select",
        options: [
          { label: "Internal group (内部群)", value: "1" },
          { label: "Cross-company group (互通群)", value: "2" },
          { label: "Customer group (客户群)", value: "3" },
        ],
        hint: {
          en_US: "Scene type: 1=Internal, 2=Cross-company, 3=Customer",
          zh_Hans: "场景值：1=内部群，2=互通群，3=客户群",
        },
      },
    },
    {
      name: "userids",
      type: "string",
      required: false,
      display_name: {
        en_US: "User IDs",
        zh_Hans: "用户 userid 列表",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "JSON array of userids to add to the group, e.g., [\"user1\", \"user2\"]",
          zh_Hans: "JSON格式的用户ID数组，例如 [\"user1\", \"user2\"]",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "mobiles",
      type: "string",
      required: false,
      display_name: {
        en_US: "Mobile numbers",
        zh_Hans: "手机号列表",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "JSON array of mobile numbers to add to the group, e.g., [\"13800138000\", \"13900139000\"]",
          zh_Hans: "JSON格式的手机号数组，例如 [\"13800138000\", \"13900139000\"]",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "sync_from_group_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Sync from group ID",
        zh_Hans: "从已有群复制成员",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Existing group chat ID to copy members from",
          zh_Hans: "已有群聊ID，从该群复制成员",
        },
        width: "full",
      },
    },
    {
      name: "group_name",
      type: "string",
      required: false,
      display_name: {
        en_US: "Group name",
        zh_Hans: "群名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Name of the group chat",
          zh_Hans: "群聊名称",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "owner",
      type: "string",
      required: false,
      display_name: {
        en_US: "Owner userid",
        zh_Hans: "群主 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the group owner",
          zh_Hans: "群主的 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      scene?: number
      userids?: string
      mobiles?: string
      sync_from_group_id?: string
      group_name?: string
      owner?: string
    }

    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    if (typeof params.scene !== "number" || !Number.isFinite(params.scene)) {
      throw new Error("scene must be a valid integer (1, 2, or 3).")
    }

    if (params.scene < 1 || params.scene > 3) {
      throw new Error("scene must be 1 (internal), 2 (cross-company), or 3 (customer).")
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
      scene: params.scene,
    }

    if (params.userids?.trim()) {
      try {
        const userids = JSON.parse(params.userids.trim())
        if (Array.isArray(userids)) {
          body.userids = userids
        }
      } catch {
        throw new Error("userids must be a valid JSON array.")
      }
    }

    if (params.mobiles?.trim()) {
      try {
        const mobiles = JSON.parse(params.mobiles.trim())
        if (Array.isArray(mobiles)) {
          body.mobiles = mobiles
        }
      } catch {
        throw new Error("mobiles must be a valid JSON array.")
      }
    }

    if (params.sync_from_group_id?.trim()) {
      body.sync_from_group_id = params.sync_from_group_id.trim()
    }

    if (params.group_name?.trim()) {
      body.group_name = params.group_name.trim()
    }

    if (params.owner?.trim()) {
      body.owner = params.owner.trim()
    }

    const data = await wechatWorkPostJson<CreateGroupChatResponse>(
      "/smartwork/automated/groupchat/create",
      token,
      body,
    )

    return {
      chat_id: data.chat_id ?? null,
    }
  },
}
