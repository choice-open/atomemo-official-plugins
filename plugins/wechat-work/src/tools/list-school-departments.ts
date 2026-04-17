import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listSchoolDepartmentsSkill from "./list-school-departments-skill.md" with {
  type: "text",
}

type DepartmentInfo = {
  id: number
  name: string
  parentid: number
  order: number
}

type ListSchoolDepartmentsResponse = {
  errcode?: number
  errmsg?: string
  departments?: DepartmentInfo[]
}

export const listSchoolDepartmentsTool: ToolDefinition = {
  name: "wechat-work-list-school-departments",
  display_name: {
    en_US: "List school departments",
    zh_Hans: "获取家校部门",
  },
  description: {
    en_US:
      "Fetch the list of departments (classes) in a WeChat Work school.",
    zh_Hans: "获取企业微信学校中的部门（班级）列表。",
  },
  skill: listSchoolDepartmentsSkill,
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
          en_US: "Filter by parent department ID (leave empty for root)",
          zh_Hans: "按父部门ID筛选（留空获取根部门）",
        },
        width: "full",
      },
    },
    {
      name: "fetch_child",
      type: "boolean",
      required: false,
      display_name: {
        en_US: "Fetch child departments",
        zh_Hans: "递归获取子部门",
      },
      ui: {
        component: "switch",
        hint: {
          en_US: "Whether to recursively fetch child departments",
          zh_Hans: "是否递归获取子部门",
        },
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      school_id?: string
      parent_department_id?: string
      fetch_child?: boolean
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const schoolId = params.school_id?.trim()
    if (!schoolId) {
      throw new Error("school_id is required.")
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

    const extraParams: Record<string, string> = { school_id: schoolId }
    const parentDepartmentId = params.parent_department_id?.trim()
    if (parentDepartmentId) {
      extraParams.id = parentDepartmentId
    }
    if (params.fetch_child !== undefined) {
      extraParams.fetch_child = params.fetch_child ? "1" : "0"
    }

    const data = await wechatWorkGetJson<ListSchoolDepartmentsResponse>(
      "/school/department/list",
      token,
      extraParams,
    )
    return { departments: data.departments ?? [] }
  },
}
