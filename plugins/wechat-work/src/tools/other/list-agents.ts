import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listAgentsSkill from "./list-agents-skill.md" with { type: "text" }

type ListAgentsResponse = {
  errcode?: number
  errmsg?: string
  agentlist?: Array<{
    agentid: number
    name: string
    square_logo_url: string
  }>
}

export const listAgentsTool: ToolDefinition = {
  name: "wechat-work-list-agents",
  display_name: {
    en_US: "List applications",
    zh_Hans: "获取应用列表",
  },
  description: {
    en_US: "Get the list of WeChat Work applications.",
    zh_Hans: "获取企业微信自建应用列表。",
  },
  skill: listAgentsSkill,
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
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

    const data = await wechatWorkGetJson<ListAgentsResponse>(
      "/agent/list",
      token,
    )
    return {
      agentlist: data.agentlist ?? [],
    }
  },
}