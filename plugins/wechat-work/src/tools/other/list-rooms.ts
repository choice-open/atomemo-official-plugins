import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkGetJson,
} from "../wechat-work/client"
import listRoomsSkill from "./list-rooms-skill.md" with { type: "text" }

type ListRoomsResponse = {
  errcode?: number
  errmsg?: string
  rooms?: Array<{
    room_id?: string
    name?: string
    capacity?: number
    building?: string
    floor?: string
  }>
  total?: number
}

export const listRoomsTool: ToolDefinition = {
  name: "wechat-work-list-rooms",
  display_name: {
    en_US: "List meeting rooms",
    zh_Hans: "获取会议室列表",
  },
  description: {
    en_US: "Get a list of meeting rooms in WeChat Work.",
    zh_Hans: "获取企业微信中的会议室列表。",
  },
  skill: listRoomsSkill,
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
      name: "offset",
      type: "string",
      required: false,
      display_name: {
        en_US: "Offset",
        zh_Hans: "偏移量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Offset for pagination",
          zh_Hans: "分页偏移量",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "limit",
      type: "string",
      required: false,
      display_name: {
        en_US: "Limit",
        zh_Hans: "返回数量",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Number of rooms to return",
          zh_Hans: "返回的会议室数量",
        },
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      offset?: string
      limit?: string
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

    const extraParams: Record<string, string> = {}
    const offset = params.offset?.trim()
    if (offset) extraParams.offset = offset
    const limit = params.limit?.trim()
    if (limit) extraParams.limit = limit

    const data = await wechatWorkGetJson<ListRoomsResponse>(
      "/rooms/list",
      token,
      extraParams,
    )
    return { rooms: data.rooms ?? [], total: data.total ?? 0 }
  },
}