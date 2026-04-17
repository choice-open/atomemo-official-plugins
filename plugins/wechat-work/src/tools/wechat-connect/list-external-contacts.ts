import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
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
    zh_Hans: "获取客户列表",
  },
  description: {
    en_US: "Get the list of external contacts for a specified member.",
    zh_Hans: "企业可通过此接口获取指定成员添加的客户列表。客户是指配置了客户联系功能的成员所添加的外部联系人。",
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
        zh_Hans: "企业成员的userid",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The userid of the enterprise member",
          zh_Hans: "企业成员的userid",
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
      throw new Error("请选择企业微信凭证。")
    }
    const userid = params.userid?.trim()
    if (!userid) {
      throw new Error("userid 不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const data = await wechatWorkGetJson<ListExternalContactResponse>(
      "/externalcontact/list",
      token,
      { userid },
    )
    return {
      errcode: data.errcode ?? 0,
      errmsg: data.errmsg ?? "ok",
      external_userid: data.external_userid ?? [],
    }
  },
}
