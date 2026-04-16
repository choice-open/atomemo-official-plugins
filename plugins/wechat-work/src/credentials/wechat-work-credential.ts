import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { fetchAccessTokenWithSecret } from "../wechat-work/client"

export const wechatWorkCredential = {
  name: "wechat-work",
  display_name: {
    en_US: "WeChat Work credential",
    zh_Hans: "企业微信凭证",
  },
  description: {
    en_US:
      "OAuth2 client credentials (Corp ID + app secret) for WeChat Work Open API (企业微信).",
    zh_Hans:
      "企业微信开放接口的 OAuth2 客户端模式凭证（企业 ID + 应用 Secret）。",
  },
  icon: "🔐",
  oauth2: true,
  oauth2_grant_type: "client_credentials",
  parameters: [
    {
      name: "client_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Corp ID (client_id)",
        zh_Hans: "企业 ID（client_id）",
      },
      ui: {
        component: "input",
        hint: {
          en_US:
            "Enterprise ID from WeChat Work admin (我的企业 → 企业信息). Same as corpid in gettoken.",
          zh_Hans:
            "管理后台「我的企业」→「企业信息」中的企业 ID，对应 gettoken 的 corpid。",
        },
        width: "full",
      },
    },
    {
      name: "client_secret",
      type: "encrypted_string",
      required: true,
      display_name: {
        en_US: "Application Secret",
        zh_Hans: "应用 Secret",
      },
      ui: {
        component: "encrypted-input",
        hint: {
          en_US:
            "Secret of the self-built application (corpsecret in gettoken).",
          zh_Hans: "自建应用的 Secret，对应 gettoken 的 corpsecret。",
        },
        sensitive: true,
        width: "full",
      },
    },
    { name: "access_token", type: "encrypted_string" },
    { name: "refresh_token", type: "encrypted_string" },
    { name: "expires_at", type: "integer" },
  ],

  async oauth2_get_token({ args }) {
    const cid = String(args.credential.client_id ?? "").trim()
    const secret = String(args.credential.client_secret ?? "").trim()
    if (!cid || !secret) {
      throw new Error(
        "WeChat Work requires client_id (Corp ID) and client_secret (app secret).",
      )
    }
    const { access_token, expires_at } = await fetchAccessTokenWithSecret(
      cid,
      secret,
    )
    return {
      parameters_patch: {
        access_token,
        refresh_token: "",
        expires_at,
      },
    }
  },

  async oauth2_refresh_token({ args }) {
    const cid = String(args.credential.client_id ?? "").trim()
    const secret = String(args.credential.client_secret ?? "").trim()
    if (!cid || !secret) {
      throw new Error(
        "WeChat Work requires client_id (Corp ID) and client_secret (app secret).",
      )
    }
    const { access_token, expires_at } = await fetchAccessTokenWithSecret(
      cid,
      secret,
    )
    return {
      parameters_patch: {
        access_token,
        expires_at,
      },
    }
  },
} satisfies CredentialDefinition
