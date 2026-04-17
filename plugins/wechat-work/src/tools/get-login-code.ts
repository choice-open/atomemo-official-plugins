import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getLoginCodeSkill from "./get-login-code-skill.md" with { type: "text" }

type GetLoginCodeResponse = {
  errcode?: number
  errmsg?: string
  auth_code?: string
}

export const getLoginCodeTool: ToolDefinition = {
  name: "wechat-work-get-login-code",
  display_name: {
    en_US: "Get login authcode",
    zh_Hans: "获取登录CODE",
  },
  description: {
    en_US: "Get the login authcode for WeChat Work Web login.",
    zh_Hans: "获取企业微信Web登录的授权码。",
  },
  skill: getLoginCodeSkill,
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

    const data = await wechatWorkGetJson<GetLoginCodeResponse>(
      "/login/authcode/get",
      token,
    )
    return { auth_code: data.auth_code ?? "" }
  },
}