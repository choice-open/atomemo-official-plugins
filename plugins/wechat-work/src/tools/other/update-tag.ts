import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import updateTagSkill from "./update-tag-skill.md" with { type: "text" }

type UpdateTagResponse = {
  errcode?: number
  errmsg?: string
}

export const updateTagTool: ToolDefinition = {
  name: "wechat-work-update-tag",
  display_name: {
    en_US: "Update tag",
    zh_Hans: "更新标签",
  },
  description: {
    en_US: "Update an existing tag in WeChat Work.",
    zh_Hans: "更新企业微信中已有标签的信息。",
  },
  skill: updateTagSkill,
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
      name: "tagid",
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
          zh_Hans: "要更新的标签ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "tagname",
      type: "string",
      required: false,
      display_name: {
        en_US: "New tag name",
        zh_Hans: "新标签名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "New tag name",
          zh_Hans: "新标签名称",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      tagid?: string
      tagname?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const tagid = params.tagid?.trim()
    if (!tagid) {
      throw new Error("Tag ID is required.")
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
    const tid = parseInt(tagid, 10)
    if (!Number.isNaN(tid)) body.tagid = tid

    const tagname = params.tagname?.trim()
    if (tagname) body.tagname = tagname

    const data = await wechatWorkPostJson<UpdateTagResponse>(
      "/tag/update",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
