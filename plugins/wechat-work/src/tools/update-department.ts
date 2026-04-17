import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import updateDepartmentSkill from "./update-department-skill.md" with {
  type: "text",
}

type UpdateDepartmentResponse = {
  errcode?: number
  errmsg?: string
}

export const updateDepartmentTool: ToolDefinition = {
  name: "wechat-work-update-department",
  display_name: {
    en_US: "Update department",
    zh_Hans: "更新部门",
  },
  description: {
    en_US: "Update an existing department in WeChat Work organization.",
    zh_Hans: "更新企业微信中已有部门的信息。",
  },
  skill: updateDepartmentSkill,
  icon: "✏️",
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
      type: "string",
      required: true,
      display_name: {
        en_US: "Department ID",
        zh_Hans: "部门 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The department ID to update",
          zh_Hans: "要更新的部门ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "name",
      type: "string",
      required: false,
      display_name: {
        en_US: "New department name",
        zh_Hans: "新部门名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New department name (max 100 characters)",
          zh_Hans: "新的部门名称（最多100个字符）",
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
        en_US: "New parent department ID",
        zh_Hans: "新父部门 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New parent department ID",
          zh_Hans: "新的父部门ID",
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
        en_US: "New display order",
        zh_Hans: "新排序",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New display order (uint32, larger = higher priority)",
          zh_Hans: "新的显示顺序（uint32，数值越大排序越靠前）",
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
        en_US: "New English name",
        zh_Hans: "新英文名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New English department name (max 64 chars)",
          zh_Hans: "新的部门英文名称（最多64个字符）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "department_leader",
      type: "string",
      required: false,
      display_name: {
        en_US: "Department leaders",
        zh_Hans: "部门负责人",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated userids of department leaders",
          zh_Hans: "部门负责人userid列表，用逗号分隔",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      id?: string
      name?: string
      parent_id?: string
      order?: string
      name_en?: string
      department_leader?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const id = params.id?.trim()
    if (!id) {
      throw new Error("Department ID is required.")
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

    const body: Record<string, unknown> = {}
    const did = parseInt(id, 10)
    if (!Number.isNaN(did)) body.id = did

    const name = params.name?.trim()
    if (name) body.name = name

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

    const leader = params.department_leader?.trim()
    if (leader) {
      body.department_leader = leader.split(",").map((l) => l.trim())
    }

    const data = await wechatWorkPostJson<UpdateDepartmentResponse>(
      "/department/update",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
