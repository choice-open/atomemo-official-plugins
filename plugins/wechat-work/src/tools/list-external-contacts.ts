import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listExternalContactsSkill from "./list-external-contacts-skill.md" with {
  type: "text",
}

type ListExternalContactResponse = {
  errcode?: number
  errmsg?: string
  external_userid?: string[]
}

export const listExternalContactsTool: ToolDefinition = {
  name: "wechat-work-list-external-contacts",
  display_name: {
    en_US: "List external contacts",
    zh_Hans: "获取外部联系人列表",
  },
  description: {
    en_US: "Get the list of external contacts for a specified user.",
    zh_Hans: "获取指定成员的外部联系人列表。",
  },
  skill: listExternalContactsSkill,
  icon: "🤝",
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
          en_US: "The userid of the staff to get external contacts",
          zh_Hans: "成员的userid，用于获取该成员的外部联系人列表",
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

    const data = await wechatWorkGetJson<ListExternalContactResponse>(
      "/externalcontact/list",
      token,
      { userid },
    )
    return { external_userid: data.external_userid ?? [] }
  },
}
