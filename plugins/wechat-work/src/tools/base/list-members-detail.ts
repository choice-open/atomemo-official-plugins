import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import listMembersDetailSkill from "./list-members-detail-skill.md" with {
  type: "text",
}

type ListUserResponse = {
  errcode?: number
  errmsg?: string
  userlist?: Array<Record<string, unknown>>
}

export const listMembersDetailTool: ToolDefinition = {
  name: "wechat-work-list-members-detail",
  display_name: {
    en_US: "List department members (detailed)",
    zh_Hans: "获取部门成员详情",
  },
  description: {
    en_US:
      "Fetch detailed member information from a specific department in WeChat Work.",
    zh_Hans: "获取企业微信指定部门的成员详细信息。",
  },
  skill: listMembersDetailSkill,
  icon: "📋",
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
      name: "department_id",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Department ID",
        zh_Hans: "部门id",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The department ID to fetch members from.",
          zh_Hans: "获取的部门id",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      department_id?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }
    if (params.department_id == null) {
      throw new Error("部门id 不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const data = await wechatWorkGetJson<ListUserResponse>(
      "/user/list",
      token,
      { department_id: String(params.department_id) },
    )
    return JSON.parse(JSON.stringify({ userlist: data.userlist ?? [] }))
  },
}
