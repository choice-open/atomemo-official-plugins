import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import {
  resolveWechatWorkCredential,
  wechatWorkPostJson,
} from "../wechat-work/client"
import createEventSkill from "./create-event-skill.md" with { type: "text" }

type CreateEventResponse = {
  errcode?: number
  errmsg?: string
  event_id?: string
}

export const createEventTool: ToolDefinition = {
  name: "wechat-work-create-event",
  display_name: {
    en_US: "Create calendar event",
    zh_Hans: "创建日程",
  },
  description: {
    en_US: "Create a new event in a WeChat Work calendar.",
    zh_Hans: "在企业微信日历中创建新日程。",
  },
  skill: createEventSkill,
  icon: "📅",
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
      name: "cal_id",
      type: "string",
      required: true,
      display_name: {
        en_US: "Calendar ID",
        zh_Hans: "日历 ID",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Calendar ID to create the event in",
          zh_Hans: "要创建日程的日历ID",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "title",
      type: "string",
      required: true,
      display_name: {
        en_US: "Title",
        zh_Hans: "标题",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Event title (max 128 characters)",
          zh_Hans: "日程标题，最多128个字符",
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
      name: "location",
      type: "string",
      required: false,
      display_name: {
        en_US: "Location",
        zh_Hans: "地点",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Event location (max 256 characters)",
          zh_Hans: "日程地点，最多256个字符",
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
          en_US: "Event description (max 2048 characters)",
          zh_Hans: "日程描述，最多2048个字符",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "attendees",
      type: "string",
      required: false,
      display_name: {
        en_US: "Attendees (JSON array)",
        zh_Hans: "参与者 (JSON数组)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "JSON array of attendee userids or partyids",
          zh_Hans: "参与者 userid 或 partyid 的JSON数组",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "alarm_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Alarm type",
        zh_Hans: "提醒类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "Type of reminder",
          zh_Hans: "提醒类型",
        },
        options: [
          { label: "Popup (5)", value: "5" },
          { label: "Email (0)", value: "0" },
        ],
      },
    },
    {
      name: "alarm_time_before",
      type: "string",
      required: false,
      display_name: {
        en_US: "Alarm minutes before",
        zh_Hans: "提前提醒分钟数",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Minutes before start time to remind (e.g. 30)",
          zh_Hans: "提前开始时间多少分钟提醒",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "attendee_createtime",
      type: "string",
      required: false,
      display_name: {
        en_US: "Attendee create time (Unix timestamp)",
        zh_Hans: "参与者创建时间 (Unix时间戳)",
      },
      ui: {
        component: "input",
        hint: {
          en_US: "Unix timestamp when attendees are added",
          zh_Hans: "添加参与者的Unix时间戳",
        },
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "attendee_type",
      type: "string",
      required: false,
      display_name: {
        en_US: "Attendee type",
        zh_Hans: "参与者类型",
      },
      ui: {
        component: "select",
        hint: {
          en_US: "How attendees are added",
          zh_Hans: "参与者的添加方式",
        },
        options: [
          { label: { en_US: "Required", zh_Hans: "必选" }, value: "1" },
          { label: { en_US: "Optional", zh_Hans: "可选" }, value: "2" },
          { label: { en_US: "External", zh_Hans: "外部" }, value: "3" },
        ],
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const params = args.parameters as {
      wechat_work_credential?: string
      cal_id?: string
      title?: string
      start_time?: string
      end_time?: string
      location?: string
      description?: string
      attendees?: string
      alarm_type?: string
      alarm_time_before?: string
      attendee_createtime?: string
      attendee_type?: string
    }
    const credentialId = params.wechat_work_credential
    if (typeof credentialId !== "string" || !credentialId.trim()) {
      throw new Error("Select a WeChat Work credential.")
    }

    const calId = params.cal_id?.trim()
    if (!calId) {
      throw new Error("cal_id is required.")
    }

    const title = params.title?.trim()
    if (!title) {
      throw new Error("title is required.")
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

    const event: Record<string, unknown> = {
      start_time: parseInt(startTime, 10),
      end_time: parseInt(endTime, 10),
    }

    event.summary = title

    const location = params.location?.trim()
    if (location) event.location = location

    const description = params.description?.trim()
    if (description) event.description = description

    const attendeesStr = params.attendees?.trim()
    if (attendeesStr) {
      try {
        const attendees = JSON.parse(attendeesStr)
        if (Array.isArray(attendees)) {
          event.attendees = attendees
        }
      } catch {
        // ignore invalid JSON
      }
    }

    const alarmType = params.alarm_type?.trim()
    const alarmTimeBefore = params.alarm_time_before?.trim()
    if (alarmType && alarmTimeBefore) {
      event.reminders = {
        is_remind: 1,
        remind_before_secs: parseInt(alarmTimeBefore, 10) * 60,
        is_repeat: 0,
      }
    }

    const attendeeCreatetime = params.attendee_createtime?.trim()
    const attendeeType = params.attendee_type?.trim()
    if (attendeeCreatetime) {
      event.attendee_createtime = parseInt(attendeeCreatetime, 10)
    }
    if (attendeeType) {
      event.attendee_type = parseInt(attendeeType, 10)
    }

    const body: Record<string, unknown> = {
      calendar_id: calId,
      event: event,
    }

    const data = await wechatWorkPostJson<CreateEventResponse>(
      "/calendar/add",
      token,
      body,
    )
    return { event_id: data.event_id ?? "" }
  },
}