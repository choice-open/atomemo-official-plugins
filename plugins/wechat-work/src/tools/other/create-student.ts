import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createStudentSkill from "./create-student-skill.md" with { type: "text" }

type StudentInput = {
  name: string
  student_no?: string
  mobile?: string
  department_ids?: number[]
  guardian_userid?: string
  guardian_relation?: string
}

type CreateStudentResponse = {
  errcode?: number
  errmsg?: string
  student_userid_list?: Array<{ userid: string; student_no: string }>
}

export const createStudentTool: ToolDefinition = {
  name: "wechat-work-create-student",
  display_name: {
    en_US: "Create student",
    zh_Hans: "创建学生",
  },
  description: {
    en_US: "Create a new student in a WeChat Work school.",
    zh_Hans: "在企业微信学校中创建新学生。",
  },
  skill: createStudentSkill,
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
      name: "student_name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Student name",
        zh_Hans: "学生姓名",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Student's full name",
          zh_Hans: "学生姓名",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "student_no",
      type: "string",
      required: false,
      display_name: {
        en_US: "Student number",
        zh_Hans: "学号",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Student ID number",
          zh_Hans: "学号",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "mobile",
      type: "string",
      required: false,
      display_name: {
        en_US: "Mobile number",
        zh_Hans: "手机号码",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Student's mobile phone number",
          zh_Hans: "学生手机号",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "department_ids",
      type: "string",
      required: false,
      display_name: {
        en_US: "Department IDs",
        zh_Hans: "班级 ID 列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated department IDs (classes), e.g., 1,2,3",
          zh_Hans: "班级ID列表，用逗号分隔，如 1,2,3",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "guardian_userid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Guardian userid",
        zh_Hans: "家长 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The userid of the guardian to link",
          zh_Hans: "关联的家长userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "guardian_relation",
      type: "string",
      required: false,
      display_name: {
        en_US: "Guardian relation",
        zh_Hans: "家长关系",
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
      student_name?: string
      student_no?: string
      mobile?: string
      department_ids?: string
      guardian_userid?: string
      guardian_relation?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const schoolId = params.school_id?.trim()
    const studentName = params.student_name?.trim()
    if (!schoolId) {
      throw new Error("school_id is required.")
    }
    if (!studentName) {
      throw new Error("student_name is required.")
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

    const student: StudentInput = { name: studentName }

    const studentNo = params.student_no?.trim()
    if (studentNo) student.student_no = studentNo

    const mobile = params.mobile?.trim()
    if (mobile) student.mobile = mobile

    const departmentIds = params.department_ids?.trim()
    if (departmentIds) {
      student.department_ids = departmentIds
        .split(",")
        .map((d) => parseInt(d.trim(), 10))
        .filter((d) => !Number.isNaN(d))
    }

    const guardianUserid = params.guardian_userid?.trim()
    if (guardianUserid) student.guardian_userid = guardianUserid

    const guardianRelation = params.guardian_relation?.trim()
    if (guardianRelation) student.guardian_relation = guardianRelation

    const body: Record<string, unknown> = {
      school_id: schoolId,
      students: [student],
    }

    const data = await wechatWorkPostJson<CreateStudentResponse>(
      "/school/user/create_student",
      token,
      body,
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      student_userid_list: data.student_userid_list ?? [],
    }
  },
}
