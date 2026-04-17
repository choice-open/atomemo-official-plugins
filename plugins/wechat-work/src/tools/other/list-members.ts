import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listMembersSkill from "./list-members-skill.md" with { type: "text" }

type SimpleListUserResponse = {
  errcode?: number
  errmsg?: string
  user?: Array<{
    userid: string
    name: string
    department: number[]
    position: string
    mobile: string
    email: string
    avatar: string
    status: number
  }>
}

export const listMembersTool: ToolDefinition = {
  name: "wechat-work-list-members",
  display_name: {
    en_US: "List department members",
    zh_Hans: "获取部门成员",
  },
  description: {
    en_US: "Fetch the member list from a specific department in WeChat Work.",
    zh_Hans: "获取企业微信指定部门的成员列表。",
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
      type: "string",
      required: true,
      display_name: {
        en_US: "Department ID",
        zh_Hans: "部门 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The department ID to fetch members from",
          zh_Hans: "要获取成员的部门ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "fetch_child",
      type: "string",
      required: false,
      display_name: {
        en_US: "Fetch child departments",
        zh_Hans: "递归子部门",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "1: include child departments, 0: this dept only",
          zh_Hans: "1：递归子部门，0：仅本部门",
        },
        options: [
          {
            label: { en_US: "Yes (default)", zh_Hans: "是（默认）" },
            value: "1",
          },
          { label: { en_US: "No", zh_Hans: "否" }, value: "0" },
        ],
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      department_id?: string
      fetch_child?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const departmentId = params.department_id?.trim()
    if (!departmentId) {
      throw new Error("Department ID is required.")
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

    const data = await wechatWorkGetJson<SimpleListUserResponse>(
      "/user/simplelist",
      token,
      {
        department_id: departmentId,
        fetch_child: params.fetch_child?.trim() || "1",
      },
    )
    return { user: data.user ?? [] }
  },
}
