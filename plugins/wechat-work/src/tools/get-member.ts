import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getMemberSkill from "./get-member-skill.md" with { type: "text" }

type GetUserResponse = {
  errcode?: number
  errmsg?: string
  userid?: string
  name?: string
  department?: number[]
  position?: string
  mobile?: string
  email?: string
  avatar?: string
  thumb_avatar?: string
  status?: number
  enable?: number
  is_leader_in_department?: number[]
  external_position?: string
  address?: string
  open_userid?: string
}

export const getMemberTool: ToolDefinition = {
  name: "wechat-work-get-member",
  display_name: {
    en_US: "Get member details",
    zh_Hans: "获取成员详情",
  },
  description: {
    en_US: "Get detailed information about a specific member in WeChat Work.",
    zh_Hans: "获取企业微信中指定成员的详细信息。",
  },
  skill: getMemberSkill,
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
          en_US: "The member's userid",
          zh_Hans: "成员的 userid",
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

    const data = await wechatWorkGetJson<GetUserResponse>("/user/get", token, {
      userid,
    })
    const result: {
      userid?: string
      name?: string
      department?: number[]
      position?: string
      mobile?: string
      email?: string
      avatar?: string
      thumb_avatar?: string
      status?: number
      enable?: number
      is_leader_in_department?: number[]
      external_position?: string
      address?: string
      open_userid?: string
    } = {}
    if (data.userid !== undefined) result.userid = data.userid
    if (data.name !== undefined) result.name = data.name
    if (data.department !== undefined) result.department = data.department
    if (data.position !== undefined) result.position = data.position
    if (data.mobile !== undefined) result.mobile = data.mobile
    if (data.email !== undefined) result.email = data.email
    if (data.avatar !== undefined) result.avatar = data.avatar
    if (data.thumb_avatar !== undefined) result.thumb_avatar = data.thumb_avatar
    if (data.status !== undefined) result.status = data.status
    if (data.enable !== undefined) result.enable = data.enable
    if (data.is_leader_in_department !== undefined)
      result.is_leader_in_department = data.is_leader_in_department
    if (data.external_position !== undefined)
      result.external_position = data.external_position
    if (data.address !== undefined) result.address = data.address
    if (data.open_userid !== undefined) result.open_userid = data.open_userid
    return result
  },
}
