import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import secondVerifySkill from "./second-verify-skill.md" with { type: "text" }

type SecondVerifyResponse = {
  errcode?: number
  errmsg?: string
}

export const secondVerifyTool: ToolDefinition = {
  name: "wechat-work-second-verify",
  display_name: {
    en_US: "Second verification",
    zh_Hans: "二次验证成员身份",
  },
  description: {
    en_US: "Perform second verification for a WeChat Work member.",
    zh_Hans: "对企业微信成员进行二次验证。",
  },
  skill: secondVerifySkill,
  icon: "✅",
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
      name: "userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "User ID",
        zh_Hans: "成员 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Userid of the member to verify",
          zh_Hans: "要验证的成员 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      userid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("User ID is required.")
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

    const data = await wechatWorkPostJson<SecondVerifyResponse>(
      "/user/secondverify",
      token,
      { userid },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}