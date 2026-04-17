import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getTagMembersSkill from "./get-tag-members-skill.md" with { type: "text" }

type GetTagMembersResponse = {
  errcode?: number
  errmsg?: string
  tagname?: string
  userlist?: Array<{
    userid: string
    name: string
  }>
  partylist?: Array<{
    partyid: number
  }>
}

export const getTagMembersTool: ToolDefinition = {
  name: "wechat-work-get-tag-members",
  display_name: {
    en_US: "Get tag members",
    zh_Hans: "获取标签成员",
  },
  description: {
    en_US: "Get the list of members in a WeChat Work tag.",
    zh_Hans: "获取企业微信标签下的成员列表。",
  },
  skill: getTagMembersSkill,
  icon: "🏷️",
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
      name: "tag_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Tag ID",
        zh_Hans: "标签 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Tag ID to get members from",
          zh_Hans: "要获取成员的标签 ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      tag_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const tagId = params.tag_id?.trim()
    if (!tagId) {
      throw new Error("tag_id is required.")
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

    const data = await wechatWorkGetJson<GetTagMembersResponse>(
      "/tag/get",
      token,
      { tagid: tagId },
    )
    return {
      tagname: data.tagname ?? "",
      userlist: data.userlist ?? [],
      partylist: data.partylist ?? [],
    }
  },
}