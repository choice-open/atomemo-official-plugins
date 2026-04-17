import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deleteCorpTagSkill from "./delete-corp-tag-skill.md" with { type: "text" }

type DeleteCorpTagResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteCorpTagTool: ToolDefinition = {
  name: "wechat-work-delete-corp-tag",
  display_name: {
    en_US: "Delete enterprise customer tag",
    zh_Hans: "删除企业客户标签",
  },
  description: {
    en_US: "Delete enterprise customer tags from WeChat Work.",
    zh_Hans: "删除企业微信中的企业客户标签。",
  },
  skill: deleteCorpTagSkill,
  icon: "🗑️",
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
      required: false,
      display_name: {
        en_US: "Tag ID",
        zh_Hans: "标签 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Tag ID to delete (mutually exclusive with group_id)",
          zh_Hans: "要删除的标签ID，与group_id互斥",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "group_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Group ID",
        zh_Hans: "标签组ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Group ID to delete (mutually exclusive with tag_id)",
          zh_Hans: "要删除的标签组ID，与tag_id互斥",
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
      group_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const tagId = params.tag_id?.trim()
    const groupId = params.group_id?.trim()
    if (!tagId && !groupId) {
      throw new Error("At least one of tag_id or group_id is required.")
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

    const body: Record<string, unknown> = {}
    if (tagId) body.tag_id = tagId
    if (groupId) body.group_id = groupId

    const data = await wechatWorkPostJson<DeleteCorpTagResponse>(
      "/externalcontact/del_corp_tag",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}