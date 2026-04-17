import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deletePermanentMaterialSkill from "./delete-permanent-material-skill.md" with { type: "text" }

type DeletePermanentMaterialResponse = {
  errcode?: number
  errmsg?: string
}

export const deletePermanentMaterialTool: ToolDefinition = {
  name: "wechat-work-delete-permanent-material",
  display_name: {
    en_US: "Delete permanent material",
    zh_Hans: "删除永久素材",
  },
  description: {
    en_US: "Delete a permanent material from WeChat Work.",
    zh_Hans: "删除企业微信中的永久素材。",
  },
  skill: deletePermanentMaterialSkill,
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
      name: "media_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Media ID",
        zh_Hans: "素材 media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Media ID of the permanent material to delete",
          zh_Hans: "要删除的永久素材 media_id",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      media_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const mediaId = params.media_id?.trim()
    if (!mediaId) {
      throw new Error("media_id is required.")
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

    const data = await wechatWorkPostJson<DeletePermanentMaterialResponse>(
      "/material/del_material",
      token,
      { media_id: mediaId },
    )

    return {
      success: true,
      media_id: mediaId,
    }
  },
}
