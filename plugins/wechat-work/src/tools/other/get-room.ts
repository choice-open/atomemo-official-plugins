import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import getRoomSkill from "./get-room-skill.md" with { type: "text" }

type GetRoomResponse = {
  errcode?: number
  errmsg?: string
  room?: {
    room_id?: string
    name?: string
    capacity?: number
    building?: string
    floor?: string
    equipment?: string[]
  }
}

export const getRoomTool: ToolDefinition = {
  name: "wechat-work-get-room",
  display_name: {
    en_US: "Get meeting room details",
    zh_Hans: "获取会议室详情",
  },
  description: {
    en_US: "Get details of a specific meeting room in WeChat Work.",
    zh_Hans: "获取企业微信中指定会议室的详情。",
  },
  skill: getRoomSkill,
  icon: "🏢",
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
      name: "room_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Room ID",
        zh_Hans: "会议室ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Room ID to get details for",
          zh_Hans: "要获取详情的会议室ID",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      room_id?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const roomId = params.room_id?.trim()
    if (!roomId) {
      throw new Error("room_id is required.")
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

    const data = await wechatWorkGetJson<GetRoomResponse>(
      "/rooms/get",
      token,
      { room_id: roomId },
    )
    return { room: data.room ?? {} }
  },
}