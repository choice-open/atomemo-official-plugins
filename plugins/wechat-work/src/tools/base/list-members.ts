import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import listMembersSkill from "./list-members-skill.md" with { type: "text" }

type SimpleListUserResponse = {
  errcode?: number
  errmsg?: string
  userlist?: Array<{
    userid: string
    name: string
    department: number[]
    open_userid?: string
  }>
}

export const listMembersTool: ToolDefinition = {
  name: "wechat-work-list-members",
  display_name: {
    en_US: "List department members",
    zh_Hans: "获取部门成员",
  },
  description: {
    en_US: "Fetch the simplified member list from a specific department in WeChat Work.",
    zh_Hans: "获取企业微信指定部门的成员列表（简略信息）。",
  },
  skill: listMembersSkill,
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

    const data = await wechatWorkGetJson<SimpleListUserResponse>(
      "/user/simplelist",
      token,
      { department_id: String(params.department_id) },
    )
    return { userlist: data.userlist ?? [] }
  },
}
