import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createGuardianSkill from "./create-guardian-skill.md" with { type: "text" }

type GuardianInput = {
  name: string
  mobile?: string
  student_userid?: string
  student_relation?: string
}

type CreateGuardianResponse = {
  errcode?: number
  errmsg?: string
  guardian_userid_list?: Array<{ userid: string }>
}

export const createGuardianTool: ToolDefinition = {
  name: "wechat-work-create-guardian",
  display_name: {
    en_US: "Create guardian",
    zh_Hans: "创建家长",
  },
  description: {
    en_US: "Create a new guardian (parent) in a WeChat Work school.",
    zh_Hans: "在企业微信学校中创建新家长。",
  },
  skill: createGuardianSkill,
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
      name: "guardian_name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Guardian name",
        zh_Hans: "家长姓名",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Guardian's full name",
          zh_Hans: "家长姓名",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "mobile",
      type: "string",
      required: true,
      display_name: {
        en_US: "Mobile number",
        zh_Hans: "手机号码",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Guardian's mobile phone number",
          zh_Hans: "家长手机号",
        },
        support_expression: true,
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
          en_US: "The student userid to associate with this guardian",
          zh_Hans: "关联的学生userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "student_relation",
      type: "string",
      required: false,
      display_name: {
        en_US: "Student relation",
        zh_Hans: "与学生关系",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Relationship to the student",
          zh_Hans: "与学生的关系",
        },
        options: [
          { label: { en_US: "Father", zh_Hans: "父亲" }, value: "father" },
          { label: { en_US: "Mother", zh_Hans: "母亲" }, value: "mother" },
          { label: { en_US: "Guardian", zh_Hans: "监护人" }, value: "guardian" },
          { label: { en_US: "Other", zh_Hans: "其他" }, value: "other" },
        ],
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      school_id?: string
      guardian_name?: string
      mobile?: string
      student_userid?: string
      student_relation?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const schoolId = params.school_id?.trim()
    const guardianName = params.guardian_name?.trim()
    const mobile = params.mobile?.trim()
    if (!schoolId) {
      throw new Error("school_id is required.")
    }
    if (!guardianName) {
      throw new Error("guardian_name is required.")
    }
    if (!mobile) {
      throw new Error("mobile is required.")
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

    const guardian: GuardianInput = {
      name: guardianName,
      mobile,
    }

    const studentUserid = params.student_userid?.trim()
    if (studentUserid) guardian.student_userid = studentUserid

    const studentRelation = params.student_relation?.trim()
    if (studentRelation) guardian.student_relation = studentRelation

    const body: Record<string, unknown> = {
      school_id: schoolId,
      guardians: [guardian],
    }

    const data = await wechatWorkPostJson<CreateGuardianResponse>(
      "/school/user/create_guardian",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      guardian_userid_list: data.guardian_userid_list ?? [],
    }
  },
}
