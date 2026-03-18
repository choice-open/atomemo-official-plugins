import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"
import { calendarCredentialParam } from "../lib/parameters"
import { requireCalendarClient } from "../lib/require-calendar"

export const listCalendarsTool = {
  name: "list-calendars",
  display_name: t("LIST_CALENDARS_DISPLAY_NAME"),
  description: t("LIST_CALENDARS_DESCRIPTION"),
  icon: "📆",
  parameters: [
    calendarCredentialParam,
  ],
  async invoke({ args }) {
    const calendar = requireCalendarClient(args.credentials, args.parameters.credential_id)

    const res = await calendar.calendarList.list()

    const calendars = (res.data.items ?? []).map((c) => ({
      id: c.id ?? null,
      summary: c.summary ?? null,
      summaryOverride: c.summaryOverride ?? null,
      description: c.description ?? null,
      primary: c.primary ?? null,
      accessRole: c.accessRole ?? null,
      backgroundColor: c.backgroundColor ?? null,
      foregroundColor: c.foregroundColor ?? null,
    }))

    return {
      calendars,
      count: calendars.length,
    }
  },
} satisfies ToolDefinition
