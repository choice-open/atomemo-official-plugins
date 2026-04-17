import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import deleteKfRobotSkill from "./delete-kf-robot-skill.md" with { type: "text" }

type DeleteKfRobotResponse = {
  errcode?: number
  errmsg?: string
}

export const deleteKfRobotTool: ToolDefinition = {
  name: "wechat-work-delete-kf-robot",
  display_name: {
    en_US: "Delete customer service robot",
    zh_Hans: "删除客服机器人",
  },
  description: {
    en_US: "Delete a customer service robot.",
    zh_Hans: "删除微信客服机器人。",
  },
  skill: deleteKfRobotSkill,
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
      name: "robot_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Robot ID",
        zh_Hans: "机器人ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Robot ID to delete",
          zh_Hans: "要删除的机器人ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      robot_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const robotId = params.robot_id?.trim()
    if (!robotId) {
      throw new Error("robot_id is required.")
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

    const body: Record<string, unknown> = {
      robot_id: robotId,
    }

    await wechatWorkPostJson<DeleteKfRobotResponse>(
      "/kf/robot/del",
      token,
      body,
    )
    return { success: true }
  },
}