import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import addKfAccountSkill from "./add-kf-account-skill.md" with { type: "text" }

type AddKfAccountResponse = {
  errcode?: number
  errmsg?: string
  account_id?: string
}

export const addKfAccountTool: ToolDefinition = {
  name: "wechat-work-add-kf-account",
  display_name: {
    en_US: "Add customer service account",
    zh_Hans: "添加客服账号",
  },
  description: {
    en_US: "Add a customer service (KF) account.",
    zh_Hans: "添加微信客服账号。",
  },
  skill: addKfAccountSkill,
  icon: "🎧",
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
      name: "name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Account name",
        zh_Hans: "客服名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Account name (max 16 characters)",
          zh_Hans: "客服名称，最多16个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "media_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Avatar media ID",
        zh_Hans: "头像 media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Avatar media ID from media upload",
          zh_Hans: "通过素材上传接口获取的头像media_id",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      name?: string
      media_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const name = params.name?.trim()
    if (!name) {
      throw new Error("name is required.")
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

    const body: Record<string, unknown> = { name }

    const mediaId = params.media_id?.trim()
    if (mediaId) body.avatar_media_id = mediaId

    const data = await wechatWorkPostJson<AddKfAccountResponse>(
      "/kf/account/add",
      token,
      body,
    )
    return { account_id: data.account_id ?? "" }
  },
}