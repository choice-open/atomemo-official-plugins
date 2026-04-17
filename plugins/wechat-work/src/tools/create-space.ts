import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createSpaceSkill from "./create-space-skill.md" with { type: "text" }

type CreateSpaceResponse = {
  errcode?: number
  errmsg?: string
  space_id?: string
}

export const createSpaceTool: ToolDefinition = {
  name: "wechat-work-create-space",
  display_name: {
    en_US: "Create WeDrive space",
    zh_Hans: "创建微盘空间",
  },
  description: {
    en_US: "Create a new WeDrive space.",
    zh_Hans: "创建一个新的微盘空间。",
  },
  skill: createSpaceSkill,
  icon: "📁",
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
      name: "space_name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Space name",
        zh_Hans: "空间名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The name of the WeDrive space to create",
          zh_Hans: "要创建的微盘空间名称",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "space_owner_userid",
      type: "string",
      required: true,
      display_name: {
        en_US: "Space owner user ID",
        zh_Hans: "空间负责人用户ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "The user ID who will own this space",
          zh_Hans: "空间负责人用户ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      space_name?: string
      space_owner_userid?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }
    const spaceName = params.space_name?.trim()
    if (!spaceName) {
      throw new Error("space_name is required.")
    }
    const spaceOwnerUserid = params.space_owner_userid?.trim()
    if (!spaceOwnerUserid) {
      throw new Error("space_owner_userid is required.")
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

    const data = await wechatWorkPostJson<CreateSpaceResponse>(
      "/wedrive/space_create",
      token,
      {
        space_name: spaceName,
        space_owner_userid: spaceOwnerUserid,
      },
    )
    return { space_id: data.space_id ?? null }
  },
}