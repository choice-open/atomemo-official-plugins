import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  eventIdParam,
  sendUpdatesParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"
import moveEventSkill from "./move-event-skill.md" with { type: "text" }

export const moveEventTool: ToolDefinition = {
  name: "move-event",
  display_name: t("MOVE_EVENT_DISPLAY_NAME"),
  description: t("MOVE_EVENT_DESCRIPTION"),
  skill: moveEventSkill,
  icon: "➡️",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    eventIdParam,
    {
      name: "destination_calendar_id",
      type: "string",
      required: true,
      display_name: t("DESTINATION_CALENDAR_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            'Target calendar identifier to move the event to. Use "primary" or a calendar email address.',
          zh_Hans: '目标日历标识符。使用 "primary" 或日历邮箱地址。',
        },
      },
      ui: {
        component: "input",
        hint: t("DESTINATION_CALENDAR_HINT"),
        placeholder: t("CALENDAR_ID_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
    sendUpdatesParam,
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { calendar_id, event_id, destination_calendar_id, send_updates } =
      args.parameters

    const res = await client.events.move({
      calendarId: calendar_id as string,
      eventId: event_id as string,
      destination: destination_calendar_id as string,
      sendUpdates: (send_updates as string) || undefined,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
