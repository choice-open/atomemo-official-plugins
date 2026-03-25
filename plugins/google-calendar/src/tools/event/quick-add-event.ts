import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import {
  calendarCredentialParam,
  calendarIdParam,
  sendUpdatesParam,
} from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const quickAddEventTool: ToolDefinition = {
  name: "quick-add-event",
  display_name: t("QUICK_ADD_EVENT_DISPLAY_NAME"),
  description: t("QUICK_ADD_EVENT_DESCRIPTION"),
  icon: "⚡",
  parameters: [
    calendarCredentialParam,
    calendarIdParam,
    {
      name: "text",
      type: "string",
      required: true,
      min_length: 1,
      display_name: t("QUICK_ADD_TEXT_DISPLAY_NAME"),
      ai: {
        llm_description: {
          en_US:
            "Natural language text describing the event. Google parses this to extract title, date, time, and location. Examples: 'Dinner with John tomorrow at 7pm', 'Meeting at Conference Room A on Friday 2pm-3pm'.",
          zh_Hans:
            "描述事件的自然语言文本。Google 会解析其中的标题、日期、时间和地点。例如：'明天晚上7点和John吃饭'、'周五下午2点到3点在会议室A开会'。",
        },
      },
      ui: {
        component: "input",
        hint: t("QUICK_ADD_TEXT_HINT"),
        placeholder: t("QUICK_ADD_TEXT_PLACEHOLDER"),
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
    const { calendar_id, text, send_updates } = args.parameters

    const res = await client.events.quickAdd({
      calendarId: calendar_id as string,
      text: text as string,
      sendUpdates: (send_updates as string) || undefined,
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
