import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getStaffInfoSkill from "./get-staff-info-skill.md" with { type: "text" }

type FieldId = {
  fieldid: number
  sub_idx?: number
}

type FieldInfo = {
  fieldid?: number
  sub_idx?: number
  result?: number
  value_type?: number
  value_uint32?: number
  value_string?: string
  value_float?: number
  value_mobile?: {
    value_mobile_country_code?: string
    value_mobile?: string
  }
  value_text?: string
  value_webview?: string
  value_date?: number
  value_party?: number[]
  value_user?: string[]
  value_file?: string[]
}

type GetStaffInfoResponse = {
  errcode?: number
  errmsg?: string
  field_info?: FieldInfo[]
}

export const getStaffInfoTool: ToolDefinition = {
  name: "wechat-work-get-staff-info",
  display_name: {
    en_US: "Get staff roster info",
    zh_Hans: "获取花名册信息",
  },
  description: {
    en_US: "Get staff roster (HR) information for a specific employee in WeChat Work.",
    zh_Hans: "获取企业微信人事助手花名册中指定员工的信息。",
  },
  skill: getStaffInfoSkill,
  icon: "📋",
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
          en_US: "The employee's userid",
          zh_Hans: "成员的 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "get_all",
      type: "boolean",
      required: false,
      display_name: {
        en_US: "Get all fields",
        zh_Hans: "获取全部字段",
      },
      ui: {
        component: "switch",
        hint: {
          en_US: "Whether to get all fields",
          zh_Hans: "是否获取全部字段信息",
        },
        default: false,
      },
    },
    {
      name: "fieldids",
      type: "string",
      required: false,
      display_name: {
        en_US: "Field IDs (JSON array)",
        zh_Hans: "字段ID (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of field IDs, e.g. [{\"fieldid\":11004,\"sub_idx\":0}]",
          zh_Hans: "字段ID的JSON数组，例如 [{\"fieldid\":11004,\"sub_idx\":0}]",
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
      get_all?: boolean
      fieldids?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("userid is required.")
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
    }

    const getAll = params.get_all
    if (getAll !== undefined) {
      body.get_all = getAll
    }

    const fieldidsStr = params.fieldids?.trim()
    if (fieldidsStr && !getAll) {
      try {
        const fieldids = JSON.parse(fieldidsStr) as FieldId[]
        if (Array.isArray(fieldids)) {
          body.fieldids = fieldids
        }
      } catch {
        throw new Error("Invalid fieldids JSON format.")
      }
    }

    const data = await wechatWorkPostJson<GetStaffInfoResponse>(
      "/hr/get_staff_info",
      token,
      body,
    )
    return { field_info: data.field_info ?? [] }
  },
}
