import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createMemberSkill from "./create-member-skill.md" with { type: "text" }

type CreateUserResponse = {
  errcode?: number
  errmsg?: string
}

export const createMemberTool: ToolDefinition = {
  name: "wechat-work-create-member",
  display_name: {
    en_US: "Create member",
    zh_Hans: "创建成员",
  },
  description: {
    en_US: "Create a new member in WeChat Work organization.",
    zh_Hans: "在企业微信中创建新成员。",
  },
  skill: createMemberSkill,
  icon: "➕",
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
      name: "userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "User ID",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Member's unique userid",
          zh_Hans: "成员唯一标识（userid）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Name",
        zh_Hans: "姓名",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Member's name",
          zh_Hans: "成员姓名",
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
          en_US: "Mobile number",
          zh_Hans: "手机号码",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "email",
      type: "string",
      required: false,
      display_name: {
        en_US: "Email",
        zh_Hans: "邮箱",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Email address",
          zh_Hans: "邮箱地址",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "department",
      type: "string",
      required: false,
      display_name: {
        en_US: "Department IDs",
        zh_Hans: "部门 ID 列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated department IDs, e.g., 1,2,3",
          zh_Hans: "部门ID列表，用逗号分隔，如 1,2,3",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "position",
      type: "string",
      required: false,
      display_name: {
        en_US: "Position",
        zh_Hans: "职务",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Job title",
          zh_Hans: "职务",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "gender",
      type: "string",
      required: false,
      display_name: {
        en_US: "Gender",
        zh_Hans: "性别",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Gender: 1= male, 2= female",
          zh_Hans: "性别：1=男，2=女",
        },
        options: [
          { label: { en_US: "Male", zh_Hans: "男" }, value: "1" },
          { label: { en_US: "Female", zh_Hans: "女" }, value: "2" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "telephone",
      type: "string",
      required: false,
      display_name: {
        en_US: "Telephone",
        zh_Hans: "座机",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Landline phone number",
          zh_Hans: "座机号码",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "enable",
      type: "string",
      required: false,
      display_name: {
        en_US: "Enable status",
        zh_Hans: "启用状态",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "1: enabled, 0: disabled",
          zh_Hans: "1：启用，0：禁用",
        },
        options: [
          { label: { en_US: "Enabled", zh_Hans: "启用" }, value: "1" },
          { label: { en_US: "Disabled", zh_Hans: "禁用" }, value: "0" },
        ],
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "is_leader_in_dept",
      type: "string",
      required: false,
      display_name: {
        en_US: "Leader in departments",
        zh_Hans: "部门负责人",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated: 1=leader, 0=member, matching department order",
          zh_Hans: "部门内上级，逗号分隔（1=负责人，0=成员），与department顺序对应",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "order",
      type: "string",
      required: false,
      display_name: {
        en_US: "Department order",
        zh_Hans: "部门内排序",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated order values, matching department order",
          zh_Hans: "部门内排序，逗号分隔，与department顺序对应",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      userid?: string
      name?: string
      mobile?: string
      email?: string
      department?: string
      position?: string
      gender?: string
      telephone?: string
      enable?: string
      is_leader_in_dept?: string
      order?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const userid = params.userid?.trim()
    const name = params.name?.trim()
    if (!userid || !name) {
      throw new Error("User ID and Name are required.")
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

    const body: Record<string, unknown> = {
      userid,
      name,
    }

    const mobile = params.mobile?.trim()
    if (mobile) body.mobile = mobile

    const email = params.email?.trim()
    if (email) body.email = email

    const department = params.department?.trim()
    if (department) {
      body.department = department
        .split(",")
        .map((d) => parseInt(d.trim(), 10))
        .filter((d) => !Number.isNaN(d))
    }

    const position = params.position?.trim()
    if (position) body.position = position

    const gender = params.gender?.trim()
    if (gender) body.gender = parseInt(gender, 10)

    const telephone = params.telephone?.trim()
    if (telephone) body.telephone = telephone

    const enable = params.enable?.trim()
    if (enable) body.enable = parseInt(enable, 10)

    const isLeaderInDept = params.is_leader_in_dept?.trim()
    if (isLeaderInDept) {
      body.is_leader_in_dept = isLeaderInDept
        .split(",")
        .map((v) => parseInt(v.trim(), 10))
        .filter((v) => !Number.isNaN(v))
    }

    const memberOrder = params.order?.trim()
    if (memberOrder) {
      body.order = memberOrder
        .split(",")
        .map((v) => parseInt(v.trim(), 10))
        .filter((v) => !Number.isNaN(v))
    }

    const data = await wechatWorkPostJson<CreateUserResponse>(
      "/user/create",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
