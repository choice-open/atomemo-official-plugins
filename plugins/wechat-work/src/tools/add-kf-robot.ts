import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import addKfRobotSkill from "./add-kf-robot-skill.md" with { type: "text" }

type AddKfRobotResponse = {
  errcode?: number
  errmsg?: string
  robot_id?: string
}

export const addKfRobotTool: ToolDefinition = {
  name: "wechat-work-add-kf-robot",
  display_name: {
    en_US: "Add customer service robot",
    zh_Hans: "添加客服机器人",
  },
  description: {
    en_US: "Add a customer service robot.",
    zh_Hans: "添加微信客服机器人。",
  },
  skill: addKfRobotSkill,
  icon: "🤖",
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
      name: "name",
      type: "string",
      required: true,
      display_name: {
        en_US: "Robot name",
        zh_Hans: "机器人名称",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Robot name (max 20 characters)",
          zh_Hans: "机器人名称，最多20个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "avatar_media_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Avatar media ID",
        zh_Hans: "头像 media_id",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Avatar media ID from media upload",
          zh_Hans: "通过素材上传接口获取的头像media_id",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      name?: string
      avatar_media_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const name = params.name?.trim()
    if (!name) {
      throw new Error("name is required.")
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

    const body: Record<string, unknown> = { name }

    const avatarMediaId = params.avatar_media_id?.trim()
    if (avatarMediaId) body.avatar_media_id = avatarMediaId

    const data = await wechatWorkPostJson<AddKfRobotResponse>(
      "/kf/robot/add",
      token,
      body,
    )
    return { robot_id: data.robot_id ?? "" }
  },
}