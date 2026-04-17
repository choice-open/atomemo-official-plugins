import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createMailGroupSkill from "./create-mail-group-skill.md" with { type: "text" }

type CreateMailGroupResponse = {
  errcode?: number
  errmsg?: string
  group_id?: string
}

export const createMailGroupTool: ToolDefinition = {
  name: "wechat-work-create-mail-group",
  display_name: {
    en_US: "Create mail group",
    zh_Hans: "创建群组",
  },
  description: {
    en_US: "Create a new mail group.",
    zh_Hans: "创建新的邮件群组。",
  },
  skill: createMailGroupSkill,
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
      name: "name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Group name",
        zh_Hans: "群组名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Mail group name",
          zh_Hans: "邮件群组名称",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "user_list",
      type: "array",
      required: false,
      display_name: {
        en_US: "Member user IDs",
        zh_Hans: "成员userid列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Array of user IDs",
          zh_Hans: "成员userid数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "department_list",
      type: "array",
      required: false,
      display_name: {
        en_US: "Department IDs",
        zh_Hans: "部门ID列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Array of department IDs",
          zh_Hans: "部门ID数组",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      name?: string
      user_list?: string[]
      department_list?: number[]
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const name = params.name?.trim()
    if (!name) {
      throw new Error("name is required.")
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

    const body: Record<string, unknown> = { name }

    if (params.user_list && Array.isArray(params.user_list)) {
      body.user_list = params.user_list
    }

    if (params.department_list && Array.isArray(params.department_list)) {
      body.department_list = params.department_list
    }

    const data = await wechatWorkPostJson<CreateMailGroupResponse>(
      "/mail/group/create",
      token,
      body,
    )
    return {
      group_id: data.group_id ?? "",
    }
  },
}