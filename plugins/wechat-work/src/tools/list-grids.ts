import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listGridsSkill from "./list-grids-skill.md" with {
  type: "text",
}

type ListGridsResponse = {
  errcode?: number
  errmsg?: string
  grid_list?: Array<{
    grid_id: string
    grid_name: string
    grid_parent_id: string
    grid_admin: string[]
    grid_member: string[]
  }>
}

export const listGridsTool: ToolDefinition = {
  name: "wechat-work-list-grids",
  display_name: {
    en_US: "List grids",
    zh_Hans: "获取网格列表",
  },
  description: {
    en_US: "Get the list of grids in WeChat Work government-citizen communication.",
    zh_Hans: "获取企业微信政民沟通中的网格列表。",
  },
  skill: listGridsSkill,
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
      name: "grid_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Grid ID",
        zh_Hans: "网格 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Grid ID to query. Leave empty for root nodes.",
          zh_Hans: "网格ID，留空则获取根节点及其子节点",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      grid_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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
    const gridId = params.grid_id?.trim()
    if (gridId) {
      body.grid_id = gridId
    }

    const data = await wechatWorkPostJson<ListGridsResponse>(
      "/report/grid/list",
      token,
      body,
    )
    return { grid_list: data.grid_list ?? [] }
  },
}
