import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import listDepartmentsDetailSkill from "./list-departments-detail-skill.md" with {
  type: "text",
}

type DepartmentListResponse = {
  errcode?: number
  errmsg?: string
  department?: Array<{
    id: number
    name: string
    name_en?: string
    department_leader?: string[]
    parentid: number
    order: number
  }>
}

export const listDepartmentsDetailTool: ToolDefinition = {
  name: "wechat-work-list-departments-detail",
  display_name: {
    en_US: "List departments",
    zh_Hans: "获取部门列表",
  },
  description: {
    en_US:
      "Fetch the full department list with names from WeChat Work.",
    zh_Hans: "获取企业微信组织架构中的部门列表（包含名称等详情）。",
  },
  skill: listDepartmentsDetailSkill,
  icon: "🏢",
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
      name: "id",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Department ID",
        zh_Hans: "部门id",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US:
            "Department ID. Gets the specified department and its sub-departments (recursively). If not set, returns the full organization.",
          zh_Hans:
            "部门id。获取指定部门及其下的子部门（以及子部门的子部门等等，递归）。如果不填，默认获取全量组织架构",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      id?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }
    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const extra: Record<string, string> | undefined =
      params.id != null ? { id: String(params.id) } : undefined

    const data = await wechatWorkGetJson<DepartmentListResponse>(
      "/department/list",
      token,
      extra,
    )
    return { department: data.department ?? [] }
  },
}
