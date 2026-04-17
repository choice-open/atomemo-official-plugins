import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import listExternalContactTagsSkill from "./list-external-contact-tags-skill.md" with {
  type: "text",
}

type GetCorpTagListResponse = {
  errcode?: number
  errmsg?: string
  tag_group?: Array<{
    group_id: string
    group_name: string
    create_time: number
    tag?: Array<{
      id: string
      name: string
      create_time: number
    }>
  }>
}

export const listExternalContactTagsTool: ToolDefinition = {
  name: "wechat-work-list-external-contact-tags",
  display_name: {
    en_US: "List external contact tags",
    zh_Hans: "获取外部联系人标签",
  },
  description: {
    en_US: "Get enterprise external contact tags.",
    zh_Hans: "获取企业外部联系人标签。",
  },
  skill: listExternalContactTagsSkill,
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
      required: false,
      display_name: {
        en_US: "Tag IDs (JSON array)",
        zh_Hans: "标签 ID 列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: 'JSON array of tag IDs, e.g., ["etxxx"]',
          zh_Hans: '标签ID的JSON数组，如 ["etxxx"]',
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
        en_US: "Group IDs (JSON array)",
        zh_Hans: "标签组 ID 列表 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: 'JSON array of group IDs, e.g., ["etxxx"]',
          zh_Hans: '标签组ID的JSON数组，如 ["etxxx"]',
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

    const tagIdStr = params.tag_id?.trim()
    if (tagIdStr) {
      try {
        body.tag_id = JSON.parse(tagIdStr)
      } catch {
        throw new Error("Invalid JSON in tag_id field")
      }
    }

    const groupIdStr = params.group_id?.trim()
    if (groupIdStr) {
      try {
        body.group_id = JSON.parse(groupIdStr)
      } catch {
        throw new Error("Invalid JSON in group_id field")
      }
    }

    const data = await wechatWorkPostJson<GetCorpTagListResponse>(
      "/externalcontact/get_corp_tag_list",
      token,
      body,
    )
    return { tag_group: data.tag_group ?? [] }
  },
}
