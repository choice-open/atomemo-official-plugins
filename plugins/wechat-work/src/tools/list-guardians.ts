import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listGuardiansSkill from "./list-guardians-skill.md" with { type: "text" }

type GuardianInfo = {
  userid: string
  name: string
  mobile: string
  students: Array<{
    student_userid: string
    student_name: string
    relation: string
  }>
}

type ListGuardiansResponse = {
  errcode?: number
  errmsg?: string
  guardians?: GuardianInfo[]
  offset?: number
  limit?: number
  total?: number
}

export const listGuardiansTool: ToolDefinition = {
  name: "wechat-work-list-guardians",
  display_name: {
    en_US: "List guardians",
    zh_Hans: "获取家长列表",
  },
  description: {
    en_US: "Fetch the list of guardians (parents) in a WeChat Work school.",
    zh_Hans: "获取企业微信学校中的家长列表。",
  },
  skill: listGuardiansSkill,
  icon: "👨‍👩‍👧",
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
      name: "student_userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Student userid",
        zh_Hans: "学生 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Filter by specific student's userid to get related guardians",
          zh_Hans: "按学生userid筛选，获取该学生的家长",
        },
        width: "full",
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
      student_userid?: string
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
    const studentUserid = params.student_userid?.trim()
    if (studentUserid) extraParams.student_userid = studentUserid
    if (
      typeof params.offset === "number" &&
      Number.isFinite(params.offset)
    ) {
      extraParams.offset = String(params.offset)
    }
    if (typeof params.limit === "number" && Number.isFinite(params.limit)) {
      extraParams.limit = String(params.limit)
    }

    const data = await wechatWorkGetJson<ListGuardiansResponse>(
      "/school/user/list_guardian",
      token,
      extraParams,
    )
    return {
      guardians: data.guardians ?? [],
      offset: data.offset ?? 0,
      limit: data.limit ?? 0,
      total: data.total ?? 0,
    }
  },
}
