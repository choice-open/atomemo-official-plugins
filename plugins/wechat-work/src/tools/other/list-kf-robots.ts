import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listKfRobotsSkill from "./list-kf-robots-skill.md" with { type: "text" }

type RobotItem = {
  robot_id?: string
  name?: string
  avatar?: string
}

type ListKfRobotsResponse = {
  errcode?: number
  errmsg?: string
  robot_list?: RobotItem[]
}

export const listKfRobotsTool: ToolDefinition = {
  name: "wechat-work-list-kf-robots",
  display_name: {
    en_US: "List customer service robots",
    zh_Hans: "获取客服机器人列表",
  },
  description: {
    en_US: "Get the list of customer service robots.",
    zh_Hans: "获取微信客服机器人列表。",
  },
  skill: listKfRobotsSkill,
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
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
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

    const data = await wechatWorkGetJson<ListKfRobotsResponse>(
      "/kf/robot/list",
      token,
    )
    return { robot_list: data.robot_list ?? [] }
  },
}