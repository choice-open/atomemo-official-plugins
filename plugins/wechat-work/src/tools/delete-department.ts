import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import deleteDepartmentSkill from "./delete-department-skill.md" with {
  type: "text",
}

type DeleteDepartmentResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteDepartmentTool: ToolDefinition = {
  name: "wechat-work-delete-department",
  display_name: {
    en_US: "Delete department",
    zh_Hans: "删除部门",
  },
  description: {
    en_US: "Delete a department from WeChat Work organization.",
    zh_Hans: "从企业微信组织架构中删除部门。",
  },
  skill: deleteDepartmentSkill,
  icon: "🗑️",
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
          en_US: "The department ID to delete",
          zh_Hans: "要删除的部门ID",
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

    const data = await wechatWorkGetJson<DeleteDepartmentResponse>(
      "/department/delete",
      token,
      { id },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
