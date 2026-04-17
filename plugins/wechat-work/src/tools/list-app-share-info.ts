import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listAppShareInfoSkill from "./list-app-share-info-skill.md" with { type: "text" }

type ListAppShareInfoResponse = {
  errcode?: number
  errmsg?: string
  agent?: Array<{
    agentid?: number
    name?: string
    logo_url?: string
  }>
}

export const listAppShareInfoTool: ToolDefinition = {
  name: "wechat-work-list-app-share-info",
  display_name: {
    en_US: "List app share info",
    zh_Hans: "获取应用共享信息",
  },
  description: {
    en_US: "Get the list of apps shared with downstream enterprises.",
    zh_Hans: "获取应用共享给下游企业的信息列表。",
  },
  skill: listAppShareInfoSkill,
  icon: "🔗",
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
      type: "string",
      required: true,
      display_name: {
        en_US: "Agent ID",
        zh_Hans: "应用 AgentID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The agent ID to query",
          zh_Hans: "要查询的应用 AgentID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      agent_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const agentId = params.agent_id?.trim()
    if (!agentId) {
      throw new Error("Agent ID is required.")
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

    const data = await wechatWorkPostJson<ListAppShareInfoResponse>(
      "/cgi-bin/corpgroup/corp/list_app_share_info",
      token,
      { agentid: parseInt(agentId, 10) },
    )
    return {
      agent: data.agent ?? [],
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
