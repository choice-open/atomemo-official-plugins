import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import setMenuSkill from "./set-menu-skill.md" with { type: "text" }

type SetMenuResponse = {
  errcode?: number
  errmsg?: string
}

type MenuButton = {
  name: string
  type?: string
  url?: string
  key?: string
  sub_button?: MenuButton[]
}

type MenuConfig = {
  button: MenuButton[]
}

export const setMenuTool: ToolDefinition = {
  name: "wechat-work-set-menu",
  display_name: {
    en_US: "Set application menu",
    zh_Hans: "设置应用菜单",
  },
  description: {
    en_US: "Set the custom menu for a WeChat Work application.",
    zh_Hans: "设置企业微信应用的自定义菜单。",
  },
  skill: setMenuSkill,
  icon: "🔲",
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
      name: "agent_id",
      type: "integer",
      required: true,
      display_name: {
        en_US: "Agent ID",
        zh_Hans: "应用 AgentId",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The numeric agent id of your self-built app",
          zh_Hans: "自建应用的 AgentId",
        },
      },
    },
    {
      name: "menu",
      type: "string",
      required: true,
      display_name: {
        en_US: "Menu configuration (JSON)",
        zh_Hans: "菜单配置 (JSON)",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: 'Menu JSON: {"button":[{"name":"xxx","sub_button":[...]}]}',
          zh_Hans: '菜单JSON：{"button":[{"name":"xxx","sub_button":[...]}]}',
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      agent_id?: number
      menu?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const menuStr = params.menu?.trim()
    if (!menuStr) {
      throw new Error("Menu configuration is required.")
    }
    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.")
    }

    let menu: MenuConfig
    try {
      menu = JSON.parse(menuStr)
    } catch {
      throw new Error("Invalid JSON in menu field")
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

    const data = await wechatWorkPostJson<SetMenuResponse>(
      "/menu/create",
      token,
      { agentid: params.agent_id, ...menu },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
