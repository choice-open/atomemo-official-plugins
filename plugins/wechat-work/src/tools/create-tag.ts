import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createTagSkill from "./create-tag-skill.md" with { type: "text" }

type CreateTagResponse = {
  errcode?: number
  errmsg?: string
}

export const createTagTool: ToolDefinition = {
  name: "wechat-work-create-tag",
  display_name: {
    en_US: "Create tag",
    zh_Hans: "创建标签",
  },
  description: {
    en_US: "Create a new tag in WeChat Work.",
    zh_Hans: "在企业微信中创建新标签。",
  },
  skill: createTagSkill,
  icon: "➕",
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
      name: "tagname",
      type: "string",
      required: true,
      display_name: {
        en_US: "Tag name",
        zh_Hans: "标签名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Tag name",
          zh_Hans: "标签名称",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "tagid",
      type: "string",
      required: false,
      display_name: {
        en_US: "Tag ID",
        zh_Hans: "标签 ID",
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      tagname?: string
      tagid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const tagname = params.tagname?.trim()
    if (!tagname) {
      throw new Error("Tag name is required.")
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

    const body: Record<string, unknown> = { tagname }
    const tagid = params.tagid?.trim()
    if (tagid) {
      const tid = parseInt(tagid, 10)
      if (!Number.isNaN(tid)) body.tagid = tid
    }

    const data = await wechatWorkPostJson<CreateTagResponse>(
      "/tag/create",
      token,
      body,
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
