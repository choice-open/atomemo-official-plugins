import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import deleteTagSkill from "./delete-tag-skill.md" with { type: "text" }

type DeleteTagResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteTagTool: ToolDefinition = {
  name: "wechat-work-delete-tag",
  display_name: {
    en_US: "Delete tag",
    zh_Hans: "删除标签",
  },
  description: {
    en_US: "Delete a tag from WeChat Work.",
    zh_Hans: "从企业微信中删除标签。",
  },
  skill: deleteTagSkill,
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
          en_US: "Tag ID to delete",
          zh_Hans: "要删除的标签ID",
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

    const data = await wechatWorkGetJson<DeleteTagResponse>(
      "/tag/delete",
      token,
      { tagid },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
