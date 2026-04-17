import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getFollowUserListSkill from "./get-follow-user-list-skill.md" with { type: "text" }

type GetFollowUserListResponse = {
  errcode?: number
  errmsg?: string
  follow_user_list?: Array<{
    userid: string
    add_customer_total: number
    add_customer_cnt: number
    delete_customer_cnt: number
    delete_customer_total: number
    net_customer_cnt: number
  }>
}

export const getFollowUserListTool: ToolDefinition = {
  name: "wechat-work-get-follow-user-list",
  display_name: {
    en_US: "Get follow user list",
    zh_Hans: "获取配置了客户联系的成员列表",
  },
  description: {
    en_US: "Get the list of users with customer contact enabled.",
    zh_Hans: "获取配置了客户联系功能的成员列表。",
  },
  skill: getFollowUserListSkill,
  icon: "👥",
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

    const data = await wechatWorkGetJson<GetFollowUserListResponse>(
      "/externalcontact/get_follow_user_list",
      token,
    )
    return { follow_user_list: data.follow_user_list ?? [] }
  },
}