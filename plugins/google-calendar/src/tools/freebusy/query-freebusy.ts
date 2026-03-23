import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../../i18n/i18n-node"
import { calendarCredentialParam } from "../../lib/parameters"
import { requireCalendarClient } from "../../lib/require-calendar"
import { sanitizeObject } from "../../lib/sanitize-object"

export const queryFreebusyTool: ToolDefinition = {
  name: "query-freebusy",
  display_name: t("FREEBUSY_QUERY_DISPLAY_NAME"),
  description: t("FREEBUSY_QUERY_DESCRIPTION"),
  icon: "📊",
  parameters: [
    calendarCredentialParam,
    {
      name: "time_min",
      type: "string",
      required: true,
      display_name: t("TIME_MIN_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TIME_MIN_REQUIRED_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "time_max",
      type: "string",
      required: true,
      display_name: t("TIME_MAX_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("TIME_MAX_REQUIRED_HINT"),
        support_expression: true,
        width: "full",
      },
    },
    {
      name: "calendar_ids",
      type: "string",
      required: true,
      display_name: t("CALENDAR_IDS_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("CALENDAR_IDS_HINT"),
        placeholder: t("CALENDAR_IDS_PLACEHOLDER"),
        support_expression: true,
        width: "full",
      },
    },
  ],
  async invoke({ args }) {
    const client = requireCalendarClient(
      args.credentials,
      args.parameters.credential_id,
    )
    const { time_min, time_max, calendar_ids } = args.parameters

    const ids = (calendar_ids as string)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)

    const res = await client.freebusy.query({
      requestBody: {
        timeMin: time_min as string,
        timeMax: time_max as string,
        items: ids.map((id) => ({ id })),
      },
    })

    return sanitizeObject(res.data)
  },
} satisfies ToolDefinition
