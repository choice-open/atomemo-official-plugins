import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createGridSkill from "./create-grid-skill.md" with {
  type: "text",
}

type CreateGridResponse = {
  errcode?: number
  errmsg?: string
  grid_id?: string
  invalid_userids?: string[]
}

export const createGridTool: ToolDefinition = {
  name: "wechat-work-create-grid",
  display_name: {
    en_US: "Create grid",
    zh_Hans: "创建网格",
  },
  description: {
    en_US: "Create a new grid in WeChat Work government-citizen communication.",
    zh_Hans: "在企业微信政民沟通中创建新网格。",
  },
  skill: createGridSkill,
  icon: "🌐",
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
      name: "grid_name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Grid name",
        zh_Hans: "网格名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Grid name (max 30 characters)",
          zh_Hans: "网格名称（最多30个字符）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "grid_parent_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Parent grid ID",
        zh_Hans: "父网格 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Parent grid ID (required, max 10 levels)",
          zh_Hans: "父节点网格ID（必填，最多支持10层）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "grid_admin",
      type: "string",
      required: true,
      display_name: {
        en_US: "Grid admin userids",
        zh_Hans: "网格负责人userid列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated admin userids (at least 1, max 20)",
          zh_Hans: "负责人userid列表，逗号分隔（至少1个，最多20个）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "grid_member",
      type: "string",
      required: false,
      display_name: {
        en_US: "Grid member userids",
        zh_Hans: "网格成员userid列表",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Comma-separated member userids (max 100)",
          zh_Hans: "成员userid列表，逗号分隔（最多100个）",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      grid_name?: string
      grid_parent_id?: string
      grid_admin?: string
      grid_member?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const gridName = typeof params.grid_name === "string" ? params.grid_name.trim() : ""
    if (!gridName) {
      throw new Error("Grid name is required.")
    }
    const gridParentId = typeof params.grid_parent_id === "string" ? params.grid_parent_id.trim() : ""
    if (!gridParentId) {
      throw new Error("Parent grid ID is required.")
    }
    const gridAdmin = typeof params.grid_admin === "string" ? params.grid_admin.trim() : ""
    if (!gridAdmin) {
      throw new Error("Grid admin userids are required.")
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
      grid_name: gridName,
      grid_parent_id: gridParentId,
      grid_admin: gridAdmin.split(",").map((s) => s.trim()).filter(Boolean),
    }
    const gridMember = params.grid_member?.trim()
    if (gridMember) {
      body.grid_member = gridMember.split(",").map((s) => s.trim()).filter(Boolean)
    }

    const data = await wechatWorkPostJson<CreateGridResponse>(
      "/report/grid/add",
      token,
      body,
    )
    return {
      grid_id: data.grid_id ?? "",
      invalid_userids: data.invalid_userids ?? [],
    }
  },
}
