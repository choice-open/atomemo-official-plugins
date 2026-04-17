import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createDepartmentSkill from "./create-department-skill.md" with {
  type: "text",
}

type CreateDepartmentResponse = {
  errcode?: number
  errmsg?: string
  id?: number
}

export const createDepartmentTool: ToolDefinition = {
  name: "wechat-work-create-department",
  display_name: {
    en_US: "Create department",
    zh_Hans: "创建部门",
  },
  description: {
    en_US: "Create a new department in WeChat Work organization.",
    zh_Hans: "在企业微信中创建新部门。",
  },
  skill: createDepartmentSkill,
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
      name: "name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Department name",
        zh_Hans: "部门名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Department name (max 100 characters)",
          zh_Hans: "部门名称（最多100个字符）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "parent_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Parent department ID",
        zh_Hans: "父部门 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Parent department ID (default: 1 for root)",
          zh_Hans: "父部门ID，默认1为根部门",
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
        en_US: "Display order",
        zh_Hans: "排序",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Display order (uint32, larger = higher priority)",
          zh_Hans: "显示顺序（uint32，数值越大排序越靠前）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "name_en",
      type: "string",
      required: false,
      display_name: {
        en_US: "English name",
        zh_Hans: "英文名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "English department name (max 64 chars)",
          zh_Hans: "部门英文名称（最多64个字符）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Specified department ID",
        zh_Hans: "指定部门ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Specify department ID (int32). If not set, auto-generated",
          zh_Hans: "部门标识(32位整型)，不指定则自动生成",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      name?: string
      parent_id?: string
      order?: string
      name_en?: string
      id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const name = typeof params.name === "string" ? params.name.trim() : ""
    if (!name) {
      throw new Error("Department name is required.")
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

    const body: Record<string, unknown> = { name }
    const parentId = params.parent_id?.trim()
    if (parentId) {
      const pid = parseInt(parentId, 10)
      if (!Number.isNaN(pid)) body.parentid = pid
    }
    const order = params.order?.trim()
    if (order) {
      const o = parseInt(order, 10)
      if (!Number.isNaN(o)) body.order = o
    }
    const nameEn = params.name_en?.trim()
    if (nameEn) body.name_en = nameEn

    const id = params.id?.trim()
    if (id) {
      const did = parseInt(id, 10)
      if (!Number.isNaN(did)) body.id = did
    }

    const data = await wechatWorkPostJson<CreateDepartmentResponse>(
      "/department/create",
      token,
      body,
    )
    return { id: data.id ?? 0 }
  },
}
