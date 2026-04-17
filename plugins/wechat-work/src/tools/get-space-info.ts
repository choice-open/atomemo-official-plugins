import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getSpaceInfoSkill from "./get-space-info-skill.md" with { type: "text" }

type SpaceInfoResponse = {
  errcode?: number
  errmsg?: string
  space_info?: {
    space_id: string
    space_name: string
    space_owner_userid: string
    space_desc?: string
    total_size?: number
    used_size?: number
    file_count?: number
  }
}

export const getSpaceInfoTool: ToolDefinition = {
  name: "wechat-work-get-space-info",
  display_name: {
    en_US: "Get WeDrive space info",
    zh_Hans: "获取微盘空间信息",
  },
  description: {
    en_US: "Get detailed information for a WeDrive space.",
    zh_Hans: "获取微盘空间的详细信息。",
  },
  skill: getSpaceInfoSkill,
  icon: "💾",
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
          en_US: "The ID of the WeDrive space",
          zh_Hans: "微盘空间ID",
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

    const data = await wechatWorkGetJson<SpaceInfoResponse>(
      "/wedrive/space_info",
      token,
      { space_id: spaceId },
    )
    return data.space_info ?? null
  },
}