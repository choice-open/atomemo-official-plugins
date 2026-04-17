import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../../wechat-work/client"
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
    zh_Hans: "删除企业微信中的标签。",
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
      type: "integer",
      required: true,
      display_name: {
        en_US: "Tag ID",
        zh_Hans: "标签ID",
      },
      ui: {
        component: "number-input",
        hint: {
          en_US: "The tag ID to delete.",
          zh_Hans: "标签ID。",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      tagid?: number
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("请选择企业微信凭证。")
    }
    if (params.tagid == null) {
      throw new Error("标签ID不能为空。")
    }

    const cred = resolveWechatWorkCredential(
      args.credentials as Record<string, unknown> | undefined,
      credentialId.trim(),
    )
    const token = cred.access_token
    if (!token) {
      throw new Error("企业微信凭证缺失或没有 access_token。")
    }

    const data = await wechatWorkGetJson<DeleteTagResponse>(
      "/tag/delete",
      token,
      { tagid: String(params.tagid) },
    )
    return { errcode: data.errcode ?? 0, errmsg: data.errmsg ?? "ok" }
  },
}
