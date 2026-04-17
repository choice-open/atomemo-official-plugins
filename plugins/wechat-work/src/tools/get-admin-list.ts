import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import getAdminListSkill from "./get-admin-list-skill.md" with { type: "text" }

type GetAdminListResponse = {
  errcode?: number
  errmsg?: string
  admin_list?: string[]
}

export const getAdminListTool: ToolDefinition = {
  name: "wechat-work-get-admin-list",
  display_name: {
    en_US: "Get application admin list",
    zh_Hans: "获取应用管理员列表",
  },
  description: {
    en_US: "Get the list of administrators for a WeChat Work application.",
    zh_Hans: "获取企业微信应用的管理员列表。",
  },
  skill: getAdminListSkill,
  icon: "👤",
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
      name: "agentid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Agent ID",
        zh_Hans: "应用 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The application agent ID",
          zh_Hans: "应用 AgentId",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      agentid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const agentid = params.agentid?.trim()
    if (!agentid) {
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

    const data = await wechatWorkPostJson<GetAdminListResponse>(
      "/cgi-bin/agent/get_admin_list",
      token,
      { agentid },
    )
    return {
      admin_list: data.admin_list ?? [],
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
    }
  },
}
