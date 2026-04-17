import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
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
      type: "integer",
      required: true,
      display_name: {
        en_US: "Department ID",
        zh_Hans: "部门id",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US:
            "Department ID to delete. Cannot delete root department or departments with sub-departments/members.",
          zh_Hans:
            "部门id。（注：不能删除根部门；不能删除含有子部门、成员的部门）",
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

    const data = await wechatWorkGetJson<DeleteDepartmentResponse>(
      "/department/delete",
      token,
      { id: String(params.id) },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
