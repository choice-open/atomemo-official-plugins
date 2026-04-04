import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  eventIdParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import { optionalIanaTimezoneSchema } from "../../lib/validators"
import getEventSkill from "./get-event-skill.md" with { type: "text" }

export const getEventTool: ToolDefinition = {
  name: "get-event",
  display_name: t("GET_EVENT_DISPLAY_NAME"),
  description: t("GET_EVENT_DESCRIPTION"),
  skill: getEventSkill,
  icon: "🔍",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    eventIdParam,
    {
      name: "max_attendees",
      type: "integer",
      required: false,
      display_name: t("GET_EVENT_MAX_ATTENDEES_DISPLAY_NAME"),
      minimum: 1,
      ai: {
        llm_description: {
          en_US:
            "Cap attendees in the response (n8n Get → Options → Max Attendees).",
          zh_Hans: "限制响应中的参与者数量。",
        },
      },
      ui: {
        component: "number-input",
        hint: t("GET_EVENT_MAX_ATTENDEES_HINT"),
        support_expression: true,
      },
    },
    {
      name: "time_zone",
      type: "string",
      required: false,
      display_name: t("GET_EVENT_TIME_ZONE_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "timeZone (IANA) for times in the response. Examples: Asia/Shanghai, Europe/Berlin, Etc/UTC.",
          zh_Hans:
            "响应中时间的 IANA 时区。示例：Asia/Shanghai、Europe/Berlin、Etc/UTC。",
        },
      },
      ui: {
        component: "input",
        hint: t("GET_EVENT_TIME_ZONE_HINT"),
        placeholder: t("TIMEZONE_PLACEHOLDER"),
        support_expression: true,
      },
    },
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { calendar_id, event_id, max_attendees, time_zone } = args.parameters

    const tz = optionalIanaTimezoneSchema.parse(time_zone)
    const maxAttendees =
      typeof max_attendees === "number" && max_attendees >= 1
        ? max_attendees
        : undefined

    const res = await calendar.events.get({
      calendarId: calendar_id as string,
      eventId: event_id as string,
      maxAttendees,
      timeZone: tz,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
