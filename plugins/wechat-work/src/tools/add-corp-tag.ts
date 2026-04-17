import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import addCorpTagSkill from "./add-corp-tag-skill.md" with { type: "text" }

type AddCorpTagResponse = {
  errcode?: number
  errmsg?: string
  tag?: {
    id: string
    name: string
  }
}

export const addCorpTagTool: ToolDefinition = {
  name: "wechat-work-add-corp-tag",
  display_name: {
    en_US: "Add enterprise customer tag",
    zh_Hans: "添加企业客户标签",
  },
  description: {
    en_US: "Add an enterprise customer tag in WeChat Work.",
    zh_Hans: "在企业微信中添加企业客户标签。",
  },
  skill: addCorpTagSkill,
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
      name: "group_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Tag group ID",
        zh_Hans: "标签组ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Tag group ID to add the tag to (mutually exclusive with group_name)",
          zh_Hans: "要添加标签的标签组ID，与group_name互斥",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "group_name",
      type: "string",
      required: false,
      display_name: {
        en_US: "Tag group name",
        zh_Hans: "标签组名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New tag group name (creates new group if group_id not provided)",
          zh_Hans: "新建标签组时使用的名称，不提供则使用现有标签组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "tag_name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Tag name",
        zh_Hans: "标签名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Tag name (max 30 characters)",
          zh_Hans: "标签名称，最多30个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "tag_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Tag ID",
        zh_Hans: "标签ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Custom tag ID (optional)",
          zh_Hans: "自定义标签ID（可选）",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "sort_order",
      type: "string",
      required: false,
      display_name: {
        en_US: "Sort order",
        zh_Hans: "排序",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Sort order (default 0)",
          zh_Hans: "排序，整数",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      group_id?: string
      group_name?: string
      tag_name?: string
      tag_id?: string
      sort_order?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const groupId = params.group_id?.trim()
    const groupName = params.group_name?.trim()

    if (!groupId && !groupName) {
      throw new Error("At least one of group_id or group_name is required.")
    }

    const tagName = params.tag_name?.trim()
    if (!tagName) {
      throw new Error("tag_name is required.")
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

    const body: Record<string, unknown> = {
      tag: {
        name: tagName,
      },
    }

    if (groupId) body.tag.group_id = groupId
    if (groupName) body.group_name = groupName

    const tagId = params.tag_id?.trim()
    if (tagId) body.tag.id = tagId

    const sortOrder = params.sort_order?.trim()
    if (sortOrder) {
      body.tag.sort_order = parseInt(sortOrder, 10)
    }

    const data = await wechatWorkPostJson<AddCorpTagResponse>(
      "/externalcontact/add_corp_tag",
      token,
      body,
    )
    return {
      tag_id: data.tag?.id ?? "",
      tag_name: data.tag?.name ?? "",
    }
  },
}