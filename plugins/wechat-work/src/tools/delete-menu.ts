import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import deleteMenuSkill from "./delete-menu-skill.md" with { type: "text" }

type DeleteMenuResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteMenuTool: ToolDefinition = {
  name: "wechat-work-delete-menu",
  display_name: {
    en_US: "Delete application menu",
    zh_Hans: "删除应用菜单",
  },
  description: {
    en_US: "Delete the custom menu for a WeChat Work application.",
    zh_Hans: "删除企业微信应用的自定义菜单。",
  },
  skill: deleteMenuSkill,
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      agent_id?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    if (
      typeof params.agent_id !== "number" ||
      !Number.isFinite(params.agent_id)
    ) {
      throw new Error("agent_id must be a valid integer.")
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

    const data = await wechatWorkGetJson<DeleteMenuResponse>(
      "/menu/delete",
      token,
      { agentid: String(params.agent_id) },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
