import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getAgentSkill from "./get-agent-skill.md" with { type: "text" }

type GetAgentResponse = {
  errcode?: number
  errmsg?: string
  agentid?: number
  name?: string
  square_logo_url?: string
  description?: string
  allow_userinfos?: {
    user?: Array<{ userid: string; allow?: number }>
  }
  allow_partys?: {
    party?: Array<{ partyid: number; allow?: number }>
  }
  allow_tags?: {
    tag?: Array<{ tagid: number; allow?: number }>
  }
  close?: number
  redirect_domain?: string
  report_location?: number
  isreportenter?: number
  home_url?: string
}

export const getAgentTool: ToolDefinition = {
  name: "wechat-work-get-agent",
  display_name: {
    en_US: "Get application details",
    zh_Hans: "获取应用详情",
  },
  description: {
    en_US: "Get the details of a WeChat Work application.",
    zh_Hans: "获取企业微信自建应用的详情。",
  },
  skill: getAgentSkill,
  icon: "📱",
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

    const data = await wechatWorkGetJson<GetAgentResponse>(
      "/agent/get",
      token,
      { agentid: String(params.agent_id) },
    )
    return {
      agentid: data.agentid ?? 0,
      name: data.name ?? "",
      square_logo_url: data.square_logo_url ?? "",
      description: data.description ?? "",
      allow_userinfos: data.allow_userinfos ?? {},
      allow_partys: data.allow_partys ?? {},
      allow_tags: data.allow_tags ?? {},
      close: data.close ?? 0,
      redirect_domain: data.redirect_domain ?? "",
      report_location: data.report_location ?? 0,
      isreportenter: data.isreportenter ?? 0,
      home_url: data.home_url ?? "",
    }
  },
}