import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import updateCorpTagSkill from "./update-corp-tag-skill.md" with { type: "text" }

type UpdateCorpTagResponse = {
  errcode?: number
  errmsg?: string
}

export const updateCorpTagTool: ToolDefinition = {
  name: "wechat-work-update-corp-tag",
  display_name: {
    en_US: "Update enterprise customer tag",
    zh_Hans: "编辑企业客户标签",
  },
  description: {
    en_US: "Edit an enterprise customer tag in WeChat Work.",
    zh_Hans: "编辑企业微信中的企业客户标签。",
  },
  skill: updateCorpTagSkill,
  icon: "✏️",
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
          en_US: "Tag ID to update",
          zh_Hans: "要编辑的标签ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "tag_name",
      type: "string",
      required: false,
      display_name: {
        en_US: "Tag name",
        zh_Hans: "标签名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New tag name (max 30 characters)",
          zh_Hans: "新的标签名称，最多30个字符",
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
          en_US: "New sort order",
          zh_Hans: "新的排序，整数",
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
      tag_name?: string
      sort_order?: string
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

    const tag: Record<string, unknown> = { id: tagId }

    const tagName = params.tag_name?.trim()
    if (tagName) tag.name = tagName

    const sortOrder = params.sort_order?.trim()
    if (sortOrder) tag.sort_order = parseInt(sortOrder, 10)

    const body: Record<string, unknown> = { tag }

    const data = await wechatWorkPostJson<UpdateCorpTagResponse>(
      "/externalcontact/update_corp_tag",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}