import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
import getDepartmentSkill from "./get-department-skill.md" with { type: "text" }

type GetDepartmentResponse = {
  errcode?: number
  errmsg?: string
  department?: {
    id: number
    name: string
    name_en?: string
    department_leader?: string[]
    parentid: number
    order: number
  }
}

export const getDepartmentTool: ToolDefinition = {
  name: "wechat-work-get-department",
  display_name: {
    en_US: "Get department details",
    zh_Hans: "获取单个部门详情",
  },
  description: {
    en_US: "Get detailed information for a single department in WeChat Work.",
    zh_Hans: "获取企业微信中单个部门的详细信息。",
  },
  skill: getDepartmentSkill,
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
      required: true,
      display_name: {
        en_US: "Department ID",
        zh_Hans: "部门id",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The ID of the department to retrieve.",
          zh_Hans: "部门id",
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
    if (params.id == null) {
      throw new Error("部门id 不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const data = await wechatWorkGetJson<GetDepartmentResponse>(
      "/department/get",
      token,
      { id: String(params.id) },
    )
    return data.department ?? null
  },
}
