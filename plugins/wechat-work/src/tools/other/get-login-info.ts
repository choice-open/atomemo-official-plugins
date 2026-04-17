import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getLoginInfoSkill from "./get-login-info-skill.md" with { type: "text" }

type GetLoginInfoResponse = {
  errcode?: number
  errmsg?: string
  user_ticket?: string
  user_info?: {
    userid: string
    name: string
    avatar: string
    status: number
  }
}

export const getLoginInfoTool: ToolDefinition = {
  name: "wechat-work-get-login-info",
  display_name: {
    en_US: "Get login info",
    zh_Hans: "获取登录信息",
  },
  description: {
    en_US: "Get the user login information.",
    zh_Hans: "获取用户登录信息。",
  },
  skill: getLoginInfoSkill,
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
      name: "auth_code",
      type: "string",
      required: true,
      display_name: {
        en_US: "Auth code",
        zh_Hans: "授权码",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Auth code from login flow",
          zh_Hans: "登录流程中获取的授权码",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      auth_code?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const authCode = params.auth_code?.trim()
    if (!authCode) {
      throw new Error("auth_code is required.")
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

    const data = await wechatWorkGetJson<GetLoginInfoResponse>(
      "/user/getlogininfo",
      token,
      { auth_code: authCode },
    )
    return {
      user_ticket: data.user_ticket ?? "",
      user_info: data.user_info ?? null,
    }
  },
}