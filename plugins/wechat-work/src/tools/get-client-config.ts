import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getClientConfigSkill from "./get-client-config-skill.md" with { type: "text" }

type GetClientConfigResponse = {
  errcode?: number
  errmsg?: string
  config?: {
    imap_server?: string
    imap_port?: number
    imap_ssl?: number
    smtp_server?: string
    smtp_port?: number
    smtp_ssl?: number
  }
}

export const getClientConfigTool: ToolDefinition = {
  name: "wechat-work-get-client-config",
  display_name: {
    en_US: "Get client configuration",
    zh_Hans: "获取客户端设置",
  },
  description: {
    en_US: "Get the mail client configuration for third-party clients.",
    zh_Hans: "获取邮件客户端配置，用于第三方客户端登录。",
  },
  skill: getClientConfigSkill,
  icon: "⚙️",
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

    const data = await wechatWorkGetJson<GetClientConfigResponse>(
      "/mail/client_config/get",
      token,
    )
    return {
      config: data.config,
    }
  },
}