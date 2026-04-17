import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import bookRoomSkill from "./book-room-skill.md" with { type: "text" }

type BookRoomResponse = {
  errcode?: number
  errmsg?: string
  booking_id?: string
}

export const bookRoomTool: ToolDefinition = {
  name: "wechat-work-book-room",
  display_name: {
    en_US: "Book meeting room",
    zh_Hans: "预约会议室",
  },
  description: {
    en_US: "Book a meeting room in WeChat Work.",
    zh_Hans: "预约企业微信中的会议室。",
  },
  skill: bookRoomSkill,
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
          en_US: "Room ID to book",
          zh_Hans: "要预约的会议室ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "start_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "Start time (Unix timestamp)",
        zh_Hans: "开始时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Start time as Unix timestamp",
          zh_Hans: "开始时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "end_time",
      type: "string",
      required: true,
      display_name: {
        en_US: "End time (Unix timestamp)",
        zh_Hans: "结束时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "End time as Unix timestamp",
          zh_Hans: "结束时间的时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "booker_id",
      type: "string",
      required: false,
      display_name: {
        en_US: "Booker user ID",
        zh_Hans: "预约人用户ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "User ID of the booker",
          zh_Hans: "预约人的用户ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      required: false,
      display_name: {
        en_US: "Title",
        zh_Hans: "预约主题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Booking title",
          zh_Hans: "预约主题",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "description",
      type: "string",
      required: false,
      display_name: {
        en_US: "Description",
        zh_Hans: "描述",
      },
      ui: {
        component: "textarea",
        hint: {
          en_US: "Booking description",
          zh_Hans: "预约描述",
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
      start_time?: string
      end_time?: string
      booker_id?: string
      title?: string
      description?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const roomId = params.room_id?.trim()
    if (!roomId) {
      throw new Error("room_id is required.")
    }

    const startTime = params.start_time?.trim()
    if (!startTime) {
      throw new Error("start_time is required.")
    }

    const endTime = params.end_time?.trim()
    if (!endTime) {
      throw new Error("end_time is required.")
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
      room_id: roomId,
      start_time: parseInt(startTime, 10),
      end_time: parseInt(endTime, 10),
    }

    const bookerId = params.booker_id?.trim()
    if (bookerId) body.booker_id = bookerId

    const title = params.title?.trim()
    if (title) body.title = title

    const description = params.description?.trim()
    if (description) body.description = description

    const data = await wechatWorkPostJson<BookRoomResponse>(
      "/rooms/book",
      token,
      body,
    )
    return { booking_id: data.booking_id ?? "" }
  },
}