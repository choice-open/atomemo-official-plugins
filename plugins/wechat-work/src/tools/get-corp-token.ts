import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getCorpTokenSkill from "./get-corp-token-skill.md" with { type: "text" }

type GetCorpTokenResponse = {
  errcode?: number
  errmsg?: string
  access_token?: string
  expires_in?: number
}

export const getCorpTokenTool: ToolDefinition = {
  name: "wechat-work-get-corp-token",
  display_name: {
    en_US: "Get downstream corp token",
    zh_Hans: "获取下游企业token",
  },
  description: {
    en_US: "Get access token for a downstream enterprise in corp group.",
    zh_Hans: "获取企业互联中下游企业的访问凭证。",
  },
  skill: getCorpTokenSkill,
  icon: "🔑",
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
      name: "corpid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Downstream Corp ID",
        zh_Hans: "下游企业 CorpID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The downstream enterprise's CorpID",
          zh_Hans: "下游企业的 CorpID",
        },
        support_expression: true,
        width: "full",
      },
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
          en_US: "The agent ID shared with the downstream enterprise",
          zh_Hans: "共享给下游企业的应用 AgentID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      corpid?: string
      agent_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const corpid = params.corpid?.trim()
    if (!corpid) {
      throw new Error("Corp ID is required.")
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

    const data = await wechatWorkPostJson<GetCorpTokenResponse>(
      "/cgi-bin/corpgroup/corp/gettoken",
      token,
      { corpid, agentid: parseInt(agentId, 10) },
    )
    return {
      access_token: data.access_token ?? "",
      expires_in: data.expires_in ?? 0,
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
