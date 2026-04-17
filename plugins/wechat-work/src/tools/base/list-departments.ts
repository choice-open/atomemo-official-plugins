import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import listDepartmentsSkill from "./list-departments-skill.md" with {
  type: "text",
}

type SimpleListResponse = {
  errcode?: number
  errmsg?: string
  department_id?: Array<{ id: number; parentid: number; order: number }>
}

export const listDepartmentsTool: ToolDefinition = {
  name: "wechat-work-list-departments",
  display_name: {
    en_US: "List sub-department IDs",
    zh_Hans: "获取子部门ID列表",
  },
  description: {
    en_US:
      "Fetch the sub-department ID list from WeChat Work organization.",
    zh_Hans: "获取企业微信组织架构中的子部门ID列表。",
  },
  skill: listDepartmentsSkill,
  icon: "🗂️",
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

    const data = await wechatWorkGetJson<SimpleListResponse>(
      "/department/simplelist",
      token,
      extra,
    )
    return { department_id: data.department_id ?? [] }
  },
}
