import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getUserInfoSkill from "./get-user-info-skill.md" with { type: "text" }

type GetUserInfoResponse = {
  errcode?: number
  errmsg?: string
  UserId?: string
  DeviceId?: string
}

export const getUserInfoTool: ToolDefinition = {
  name: "wechat-work-get-user-info",
  display_name: {
    en_US: "Get user identity (OAuth2)",
    zh_Hans: "获取用户身份",
  },
  description: {
    en_US: "Get the user identity via OAuth2 web authorization.",
    zh_Hans: "通过OAuth2网页授权获取用户身份。",
  },
  skill: getUserInfoSkill,
  icon: "🔐",
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
      name: "code",
      type: "string",
      required: true,
      display_name: {
        en_US: "Authorization code",
        zh_Hans: "授权码",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "OAuth2 authorization code from redirect",
          zh_Hans: "OAuth2授权跳转后获取的code参数",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      code?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const code = params.code?.trim()
    if (!code) {
      throw new Error("code is required.")
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

    const data = await wechatWorkGetJson<GetUserInfoResponse>(
      "/user/getuserinfo",
      token,
      { code },
    )
    return {
      userid: data.UserId ?? "",
      device_id: data.DeviceId ?? "",
    }
  },
}