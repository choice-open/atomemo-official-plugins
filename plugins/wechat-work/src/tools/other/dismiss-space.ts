import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import dismissSpaceSkill from "./dismiss-space-skill.md" with { type: "text" }

type DismissSpaceResponse = {
  errcode?: number
  errmsg?: string
}

export const dismissSpaceTool: ToolDefinition = {
  name: "wechat-work-dismiss-space",
  display_name: {
    en_US: "Dismiss WeDrive space",
    zh_Hans: "解散微盘空间",
  },
  description: {
    en_US: "Dismiss (delete) a WeDrive space.",
    zh_Hans: "解散（删除）一个微盘空间。",
  },
  skill: dismissSpaceSkill,
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
      name: "space_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Space ID",
        zh_Hans: "空间 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The ID of the WeDrive space to dismiss",
          zh_Hans: "要解散的微盘空间ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      space_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const spaceId = params.space_id?.trim()
    if (!spaceId) {
      throw new Error("space_id is required.")
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

    await wechatWorkPostJson<DismissSpaceResponse>(
      "/wedrive/space_dismiss",
      token,
      { space_id: spaceId },
    )
    return { success: true }
  },
}