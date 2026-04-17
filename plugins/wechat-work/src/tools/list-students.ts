import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listStudentsSkill from "./list-students-skill.md" with { type: "text" }

type StudentInfo = {
  userid: string
  name: string
  student_no: string
  parents: Array<{
    userid: string
    name: string
    relation: string
  }>
  department_ids: number[]
  mobile: string
}

type ListStudentsResponse = {
  errcode?: number
  errmsg?: string
  students?: StudentInfo[]
  offset?: number
  limit?: number
  total?: number
}

export const listStudentsTool: ToolDefinition = {
  name: "wechat-work-list-students",
  display_name: {
    en_US: "List students",
    zh_Hans: "获取学生列表",
  },
  description: {
    en_US: "Fetch the list of students in a WeChat Work school.",
    zh_Hans: "获取企业微信学校中的学生列表。",
  },
  skill: listStudentsSkill,
  icon: "👨‍🎓",
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
      name: "department_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Department ID",
        zh_Hans: "班级 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Filter by department (class) ID",
          zh_Hans: "按班级ID筛选",
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
          en_US: "Whether to recursively fetch students from child departments",
          zh_Hans: "是否递归获取子部门的学生",
        },
      },
    },
    {
      name: "offset",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Offset",
        zh_Hans: "偏移量",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "Offset for pagination, default 0",
          zh_Hans: "分页偏移量，默认为0",
        },
      },
    },
    {
      name: "limit",
      type: "integer",
      required: false,
      display_name: {
        en_US: "Limit",
        zh_Hans: "限制数量",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "Maximum number of results, default 100, max 1000",
          zh_Hans: "返回的最大记录数，默认为100，最大1000",
        },
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      school_id?: string
      department_id?: string
      fetch_child?: boolean
      offset?: number
      limit?: number
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
    const departmentId = params.department_id?.trim()
    if (departmentId) extraParams.department_id = departmentId
    if (params.fetch_child !== undefined) {
      extraParams.fetch_child = params.fetch_child ? "1" : "0"
    }
    if (
      typeof params.offset === "number" &&
      Number.isFinite(params.offset)
    ) {
      extraParams.offset = String(params.offset)
    }
    if (typeof params.limit === "number" && Number.isFinite(params.limit)) {
      extraParams.limit = String(params.limit)
    }

    const data = await wechatWorkGetJson<ListStudentsResponse>(
      "/school/user/list_student",
      token,
      extraParams,
    )
    return {
      students: data.students ?? [],
      offset: data.offset ?? 0,
      limit: data.limit ?? 0,
      total: data.total ?? 0,
    }
  },
}
