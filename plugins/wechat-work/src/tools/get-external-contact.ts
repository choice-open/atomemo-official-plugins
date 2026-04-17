import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getExternalContactSkill from "./get-external-contact-skill.md" with {
  type: "text",
}

type GetExternalContactResponse = {
  errcode?: number
  errmsg?: string
  external_contact?: {
    external_userid: string
    type: number
    name: string
    avatar: string
    corp_name: string
    corp_full_name: string
    position: string
    follower_userid: string
  }
}

export const getExternalContactTool: ToolDefinition = {
  name: "wechat-work-get-external-contact",
  display_name: {
    en_US: "Get external contact details",
    zh_Hans: "获取外部联系人详情",
  },
  description: {
    en_US: "Get detailed information of an external contact.",
    zh_Hans: "获取外部联系人的详细信息。",
  },
  skill: getExternalContactSkill,
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
      name: "external_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "External user ID",
        zh_Hans: "外部联系人 userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "External contact's userid",
          zh_Hans: "外部联系人的 userid",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      external_userid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const externalUserid = params.external_userid?.trim()
    if (!externalUserid) {
      throw new Error("External user ID is required.")
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

    const data = await wechatWorkGetJson<GetExternalContactResponse>(
      "/externalcontact/get",
      token,
      { external_userid: externalUserid },
    )
    return data.external_contact ?? null
  },
}
