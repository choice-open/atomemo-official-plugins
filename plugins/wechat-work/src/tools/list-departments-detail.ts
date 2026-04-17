import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listDepartmentsDetailSkill from "./list-departments-detail-skill.md" with {
  type: "text",
}

type DepartmentListResponse = {
  errcode?: number
  errmsg?: string
  department?: Array<{
    id: number
    name: string
    parentid: number
    order: number
  }>
}

export const listDepartmentsDetailTool: ToolDefinition = {
  name: "wechat-work-list-departments-detail",
  display_name: {
    en_US: "List department details",
    zh_Hans: "获取部门详情列表",
  },
  description: {
    en_US:
      "Fetch the full department list with names from WeChat Work (部门详情列表).",
    zh_Hans: "获取企业微信组织架构中的部门详情列表（包含名称）。",
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
      name: "parent_department_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Parent department ID",
        zh_Hans: "父部门 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            "Optional. When empty, returns the full organization tree per API defaults.",
          zh_Hans: "可选。留空则按接口默认返回全量组织架构。",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      parent_department_id?: string
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
    const extra: Record<string, string> = {}
    const parent = params.parent_department_id?.trim()
    if (parent) extra.id = parent

    const data = await wechatWorkGetJson<DepartmentListResponse>(
      "/department/list",
      token,
      Object.keys(extra).length ? extra : undefined,
    )
    return { department: data.department ?? [] }
  },
}
